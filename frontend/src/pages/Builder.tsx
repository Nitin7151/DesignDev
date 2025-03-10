import React, { useEffect, useState, useRef } from 'react';
import ResizablePanel from '../components/ResizablePanel';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Code, Play, Eye, Check, Folder, FolderOpen, File, Download } from 'lucide-react';
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
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
  const [viewMode, setViewMode] = useState<'steps' | 'prompt' | 'files'>('steps');
  const animationTimeoutRef = useRef<NodeJS.Timeout>();
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{role: "user" | "assistant", parts: {text: string}[];}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateSet, setTemplateSet] = useState(false);
  const { webcontainer, error: webContainerError, isInitializing } = useWebContainer();

  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [steps, setSteps] = useState<Step[]>([]);

  const [files, setFiles] = useState<FileItem[]>([]);


  // Animation for steps appearing one by one
  useEffect(() => {
    
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


  // --------------------------------------create file explorer code -------------------------------------
  // yahan pe recrusively agar file nahi hai to create hora agar hai to update hora same for foler as well.
  // folder me file nahi hai to create karna, agar hai to update karna

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({status}) => status === "pending").map(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? []; 
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


// -----------------------------webContainerCode---------------------------------------------
  useEffect(() => {
    if (!webcontainer) return; // Don't try to mount if webcontainer is not available
    
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
    webcontainer.mount(mountStructure);
  }, [files, webcontainer]);


// -------------------downloading the whole folder when click on the button in zip format---------------------------------
  const exportProject = async () => {
    try {
      // Create a new JSZip instance
      const zip = new JSZip();
      
      // Recursive function to add files and folders to zip
      const addToZip = (items: FileItem[], currentPath: string = '') => {
        items.forEach(item => {
          const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name;
          
          if (item.type === 'file' && item.content) {
            // Add file to zip
            zip.file(itemPath, item.content);
          } else if (item.type === 'folder' && item.children) {
            // Create folder and add its children recursively
            addToZip(item.children, itemPath);
          }
        });
      };
      
      // Add all files and folders to zip
      addToZip(files);
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Save the zip file
      saveAs(content, 'project.zip');
      
      // Show success message
      setError('');
      alert('Project exported successfully!');
    } catch (err: any) {
      console.error('Error exporting project:', err);
      setError(`Failed to export project: ${err.message}`);
    }
  };

  // ----------------------------------1st backend api call start yahi se hora ---------------
  async function init() {
    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/ai/template`, {
      prompt: prompt.trim(),
      language: 'typescript'
    });
    setTemplateSet(true);
    

    // -------------------------------------build steps functionality----------------------------------------
    // ------------ye api prompts, ui prompts return karega so we have to pass it to another api as message-----------
    
    const {prompts, uiPrompts} = response.data;

    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({
      ...x,
      status: "pending"
    })));

    setLoading(true);
    // ------------------prompts came in ititial requres+user 3 prompt yahan pass hora------------------------------
    const stepsResponse = await axios.post(`${BACKEND_URL}/ai/chat`, {
      messages: [...prompts, prompt].map(content => ({
        role: "user",
        parts: [{ text: content }]
      }))
    })

    setLoading(false);

    // ai template ka response ko convert kar ra from xml to ui-

    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({
      ...x,
      status: "pending" as "pending"
    }))]);

    // -----setLlmMessages function updates the  user’s previous prompts and the current prompt.--------------------------
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
            
            <button 
              onClick={exportProject}
              className="px-3 py-1 rounded-md text-sm flex items-center bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-1" />
              Export Project
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex gap-6 p-6">
          <ResizablePanel 
            direction="horizontal" 
            initialSize={300} 
            minSize={200} 
            maxSize={500}
            className="h-full"
            handleClassName="bg-gray-700/50"
          >
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg h-full w-full">
              <div className="flex space-x-2 mb-4 border-b border-gray-700 pb-2">
                <button
                  onClick={() => setViewMode('steps')}
                  className={`px-3 py-2 rounded-t-md text-sm flex items-center transition-all duration-300 ${viewMode === 'steps' ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'text-gray-300 hover:text-white'}`}
                >
                  <Code className="w-4 h-4 mr-1" />
                  Build Steps
                </button>
                <button
                  onClick={() => setViewMode('files')}
                  className={`px-3 py-2 rounded-t-md text-sm flex items-center transition-all duration-300 ${viewMode === 'files' ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'text-gray-300 hover:text-white'}`}
                >
                  <Folder className="w-4 h-4 mr-1 text-yellow-400" />
                  Project Files
                </button>
                <button
                  onClick={() => setViewMode('prompt')}
                  className={`px-3 py-2 rounded-t-md text-sm flex items-center transition-all duration-300 ${viewMode === 'prompt' ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'text-gray-300 hover:text-white'}`}
                >
                  <Play className="w-4 h-4 mr-1" />
                  New Prompt
                </button>
              </div>
              <AnimatePresence mode="wait">
                {viewMode === 'steps' && (
                  <motion.div
                    key="steps-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="max-h-[75vh] overflow-auto"
                  >
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
                )}
                
                {viewMode === 'prompt' && (
                  <motion.div
                    key="prompt-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="max-h-[75vh]"
                  >

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
                      // -----------here we are sending pehle ka message and new prompt message to the ai---------
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
                {viewMode === 'files' && (
                  <motion.div
                    key="files-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="max-h-[75vh] overflow-auto"
                  >
                    <div className="flex space-x-2 mb-4">
                      <button
                        className="px-3 py-1 rounded-md text-sm flex items-center bg-gray-700 text-white"
                      >
                        <Folder className="w-4 h-4 mr-1 text-yellow-400" />
                        Files
                      </button>
                      <button
                        className="px-3 py-1 rounded-md text-sm flex items-center text-gray-300 hover:text-white"
                      >
                        <FileText className="w-4 h-4 mr-1 text-blue-400" />
                        Assets
                      </button>
                    </div>
                    <FileExplorer 
                      files={files} 
                      onFileSelect={setSelectedFile}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ResizablePanel>
          <div className="flex-1 bg-gray-800 rounded-lg shadow-lg p-4 h-[calc(100vh-8rem)]">
            <div className="flex space-x-2 mb-4 border-b border-gray-700 pb-2">
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center px-4 py-2 rounded-t-md transition-all duration-200 ${
                  activeTab === 'code'
                    ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Code className="w-4 h-4 mr-2" />
                Code Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center px-4 py-2 rounded-t-md transition-all duration-200 ${
                  activeTab === 'preview'
                    ? 'bg-gray-700 text-white border-b-2 border-blue-500'
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
                    {isInitializing ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Loader />
                        <p className="mt-4">Initializing WebContainer...</p>
                      </div>
                    ) : webContainerError ? (
                      <div className="flex flex-col items-center justify-center h-full p-8">
                        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 max-w-2xl text-center">
                          <p className="text-lg font-semibold mb-4 text-red-400">Preview Unavailable</p>
                          <p className="text-gray-300 mb-4">{webContainerError}</p>
                          <div className="bg-gray-800 p-4 rounded text-left text-sm text-gray-300 mb-4">
                            <p className="font-mono mb-2">To enable WebContainer, your server needs these headers:</p>
                            <pre className="bg-gray-900 p-2 rounded overflow-auto">
                              Cross-Origin-Embedder-Policy: require-corp
                              Cross-Origin-Opener-Policy: same-origin
                            </pre>
                          </div>
                          <p className="text-gray-400 text-sm">
                            You can still edit code and export your project without the preview functionality.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <PreviewFrame webContainer={webcontainer} files={files} />
                    )}
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