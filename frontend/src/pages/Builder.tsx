import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Code, Play, Eye, Check, Folder, FolderOpen, File } from 'lucide-react';
import { AnimatedCodeEditor } from '../components/AnimatedCodeEditor';
import { useLocation } from 'react-router-dom';
import { StepsList } from '../components/StepsList';
import { FileExplorer } from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import { CodeEditor } from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import { Step, FileItem, StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { FileNode } from '@webcontainer/api';
import { Loader } from '../components/Loader';

const MOCK_FILE_CONTENT = `// This is a sample file content
import React from 'react';

function Component() {
  return <div>Hello World</div>;
}

export default Component;`;

export function Builder() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<Step[]>([]);
  const [showPromptPanel, setShowPromptPanel] = useState(false);
  const [animatedFiles, setAnimatedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'steps' | 'prompt'>('steps');
  const animationTimeoutRef = useRef<NodeJS.Timeout>();
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", parts: {text: string}[];}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    // Animation for steps appearing one by one
    if (showAnimation && steps.length > 0 && visibleSteps.length < steps.length) {
      const nextIndex = visibleSteps.length;
      animationTimeoutRef.current = setTimeout(() => {
        setVisibleSteps(prev => [...prev, steps[nextIndex]]);
      }, 1000); // Delay between steps
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [steps, visibleSteps, showAnimation]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
        let currentFileStructure = [...originalFiles]; // {}
        let finalAnswerRef = currentFileStructure;
  
        let currentFolder = ""
        while(parsedPath.length) {
          currentFolder =  `${currentFolder}/${parsedPath[0]}`;
          let currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);
  
          if (!parsedPath.length) {
            // final file
            let file = currentFileStructure.find(x => x.path === currentFolder)
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              })
            } else {
              file.content = step.code;
            }
          } else {
            /// in a folder
            let folder = currentFileStructure.find(x => x.path === currentFolder)
            if (!folder) {
              // create the folder
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              })
            }
  
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }

    })

    if (updateHappened) {

      setFiles(originalFiles)
      setSteps(steps => steps.map((s: Step) => {
        return {
          ...s,
          status: "completed"
        }
        
      }))
    }
    console.log(files);
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, any> => {
      const mountStructure: Record<string, any> = {};
  
      const processFile = (file: FileItem, isRootFolder: boolean) => {  
        if (file.type === 'folder') {
          // For folders, create a directory entry
          mountStructure[file.name] = {
            directory: file.children ? 
              Object.fromEntries(
                file.children.map(child => [child.name, processFile(child, false)])
              ) 
              : {}
          };
        } else if (file.type === 'file') {
          if (isRootFolder) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            // For files, create a file entry with contents
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
  
        return mountStructure[file.name];
      };
  
      // Process each top-level file/folder
      files.forEach(file => processFile(file, true));
  
      return mountStructure;
    };
  
    const mountStructure = createMountStructure(files);
  
    // Mount the structure if WebContainer is available
    console.log(mountStructure);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/ai/template`, {
      prompt: prompt.trim(),
      language: 'typescript'
    });
    setTemplateSet(true);
    
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/ai/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        parts: [{ text: content }]
      }))
    })

    setLoading(false);

    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    setLlmMessages([...prompts, prompt].map(content => ({
      role: "user",
      parts: [{ text: content }]
    })));

    setLlmMessages(x => [...x, {role: "assistant", parts: [{ text: stepsResponse.data.response }]}])
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error('Error:', errorMsg);
      setError(errorMsg);
      // You might want to show this error to the user
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-100">DesignDev Builder</h1>
            <div className="flex bg-gray-700 rounded-md p-1">
              <button
                onClick={() => setViewMode('steps')}
                className={`px-3 py-1 rounded-md text-sm flex items-center ${viewMode === 'steps' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}`}
              >
                <Code className="w-4 h-4 mr-1" />
                Build Steps
              </button>
              <button
                onClick={() => setViewMode('prompt')}
                className={`px-3 py-1 rounded-md text-sm flex items-center ${viewMode === 'prompt' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}`}
              >
                <Play className="w-4 h-4 mr-1" />
                New Prompt
              </button>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-400"
            >
              Prompt: <span className="text-blue-400">{prompt}</span>
            </motion.p>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowAnimation(!showAnimation)}
              className={`px-3 py-1 rounded-md text-sm flex items-center ${showAnimation ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              <Eye className="w-4 h-4 mr-1" />
              {showAnimation ? 'Animations On' : 'Animations Off'}
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-4 gap-6 p-6">
          <div className="col-span-1 space-y-6 overflow-auto">
            <div>
              <AnimatePresence mode="wait">
                {viewMode === 'steps' ? (
                  <motion.div
                    key="steps-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="max-h-[75vh] overflow-auto bg-gray-800 rounded-lg p-4 shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                      <Code className="w-5 h-5 mr-2 text-blue-400" />
                      Build Steps
                    </h3>
                    <AnimatePresence>
                      {visibleSteps.map((step, index) => (
                        <motion.div
                          key={`step-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`mb-3 p-3 rounded-lg ${currentStep === index + 1 ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-gray-700/50'}`}
                          onClick={() => setCurrentStep(index + 1)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {step.type === StepType.CreateFile ? (
                                <File className="w-4 h-4 text-blue-400" />
                              ) : (
                                <Code className="w-4 h-4 text-purple-400" />
                              )}
                              <span className="text-sm font-medium text-gray-200">
                                {step.type === StepType.CreateFile 
                                  ? `Create ${step.path?.split('/').pop()}` 
                                  : `${step.description || 'Processing code'}`}
                              </span>
                            </div>
                            {step.status === "completed" && (
                              <Check className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    key="prompt-panel"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="max-h-[75vh] bg-gray-800 rounded-lg p-4 shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-gray-100 mb-3 flex items-center">
                      <Play className="w-5 h-5 mr-2 text-green-400" />
                      New Prompt
                    </h3>
                    <div className="space-y-3">
                      <textarea 
                        value={userPrompt} 
                        onChange={(e) => setPrompt(e.target.value)} 
                        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none h-36"
                        placeholder="Describe what you want to add or modify..."
                      />
                      <div className="flex justify-end">
                        {(loading || !templateSet) ? (
                          <div className="flex items-center space-x-2">
                            <Loader />
                            <span className="text-gray-400 text-sm">Processing...</span>
                          </div>
                        ) : (
                          <button 
                            onClick={async () => {
                    const newMessage = {
                      role: "user" as "user",
                      parts: [{ text: userPrompt }]
                    };

                    setLoading(true);
                    try {
                      const stepsResponse = await axios.post(`${BACKEND_URL}/ai/chat`, {
                        messages: [...llmMessages, newMessage]
                      });
                      setLoading(false);

                      setLlmMessages(x => [...x, newMessage]);
                      setLlmMessages(x => [...x, {
                        role: "assistant",
                        parts: [{ text: stepsResponse.data.response }]
                      }]);
                      
                      setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
                        ...x,
                        status: "pending" as "pending"
                      }))]);                      
                    } catch (error: any) {
                      setError(error.response?.data?.message || error.message);
                      setLoading(false);
                    }

                  }} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center">
                          <Play className="w-4 h-4 mr-2" />
                          Send Prompt
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </div>
          <div className="col-span-1">
              <div className="bg-gray-800 rounded-lg p-4 shadow-lg h-full">
                <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center">
                  <Folder className="w-5 h-5 mr-2 text-yellow-400" />
                  Project Files
                </h3>
                <FileExplorer 
                  files={files} 
                  onFileSelect={setSelectedFile}
                />
              </div>
            </div>
          <div className="col-span-2 bg-gray-800 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'code'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Code className="w-4 h-4 mr-2" />
                Code Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'preview'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
            </div>
            <div className="h-[calc(100%-4rem)] bg-gray-900 rounded-lg overflow-hidden">
              <AnimatePresence mode="wait">
                {activeTab === 'code' ? (
                  <motion.div
                    key="code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full p-4"
                  >
                    {selectedFile?.type === 'file' ? (
                      showAnimation && !animatedFiles.has(selectedFile.path) ? (
                        <AnimatedCodeEditor
                          code={selectedFile.content || ''}
                          fileName={selectedFile.name}
                          onComplete={() => {
                            setAnimatedFiles(prev => {
                              const newSet = new Set(prev);
                              newSet.add(selectedFile.path);
                              return newSet;
                            });
                          }}
                        />
                      ) : (
                        <div className="h-full overflow-auto">
                          <CodeEditor file={selectedFile} />
                        </div>
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <p>Select a file to view its content</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full"
                  >
                    <PreviewFrame webContainer={webcontainer} files={files} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}