import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);

  async function main() {
    setLogs(prev => [...prev, "Starting build..."]);
    
    const installProcess = await webContainer.spawn('npm', ['install']);

    let stepsCompleted = 0;
    const totalSteps = 3; // Assuming 3 major steps: npm install, build, and server start

    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        setLogs(prev => [...prev, data]);
      }
    }));

    stepsCompleted++;
    setProgress(Math.floor((stepsCompleted / totalSteps) * 100));
    
    await webContainer.spawn('npm', ['run', 'dev']);

    stepsCompleted++;
    setProgress(Math.floor((stepsCompleted / totalSteps) * 100));

    webContainer.on('server-ready', (port, url) => {
      setLogs(prev => [...prev, `Server is ready at ${url}`]);
      setUrl(url);
      setProgress(100);
    });
  }

  useEffect(() => {
    main();
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
      {!url ? (
        <div className="text-center w-3/4 bg-black text-green-400 p-4 rounded-md shadow-md h-64 overflow-auto text-sm">
          <p className="mb-2 font-bold">Build Progress: {progress}%</p>
          <div className="h-2 w-full bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-4">
            {logs.map((log, index) => (
              <p key={index} className="text-xs">
                {log}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <iframe width="100%" height="100%" src={url} />
      )}
    </div>
  );
}
