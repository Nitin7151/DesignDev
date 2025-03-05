import React, { useState, useRef, useEffect } from 'react';

interface ResizablePanelProps {
  children: React.ReactNode;
  direction: 'horizontal' | 'vertical';
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
  handleClassName?: string;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  direction = 'horizontal',
  initialSize = 300,
  minSize = 200,
  maxSize = 600,
  className = '',
  handleClassName = '',
}) => {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const resizableRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef(0);
  const startSizeRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startPosRef.current = direction === 'horizontal' ? e.clientX : e.clientY;
    startSizeRef.current = size;
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
      const delta = currentPos - startPosRef.current;
      const newSize = Math.max(minSize, Math.min(maxSize, startSizeRef.current + delta));
      
      setSize(newSize);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, direction, minSize, maxSize]);

  const resizeHandleStyles = {
    position: 'absolute',
    cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
    zIndex: 10,
    ...(direction === 'horizontal' 
      ? { top: 0, right: 0, width: '8px', height: '100%' }
      : { bottom: 0, left: 0, height: '8px', width: '100%' })
  } as React.CSSProperties;

  return (
    <div
      ref={resizableRef}
      className={`relative ${className}`}
      style={{
        [direction === 'horizontal' ? 'width' : 'height']: `${size}px`,
        transition: isResizing ? 'none' : 'width 0.1s ease, height 0.1s ease',
      }}
    >
      {children}
      <div 
        className={`hover:bg-blue-500/30 ${handleClassName}`}
        style={resizeHandleStyles}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default ResizablePanel;
