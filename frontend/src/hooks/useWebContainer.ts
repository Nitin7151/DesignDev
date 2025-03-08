import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer>();
    const [error, setError] = useState<string | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    async function main() {
        try {
            setIsInitializing(true);
            
            // Check if we're in a cross-origin isolated environment
            if (!self.crossOriginIsolated) {
                console.warn('Cross-Origin Isolation is not enabled. Checking if headers are set...');
                
                // Make a request to check if the headers are set
                const response = await fetch('/api/health');
                const headers = response.headers;
                
                // Log the headers for debugging
                console.log('Response headers:', {
                    'Cross-Origin-Embedder-Policy': headers.get('Cross-Origin-Embedder-Policy'),
                    'Cross-Origin-Opener-Policy': headers.get('Cross-Origin-Opener-Policy')
                });
                
                throw new Error(
                    'Cross-Origin Isolation is not enabled. WebContainer requires the following headers:\n' +
                    '- Cross-Origin-Embedder-Policy: require-corp\n' +
                    '- Cross-Origin-Opener-Policy: same-origin\n\n' +
                    'Please ensure your server is configured to send these headers.'
                );
            }
            
            console.log('Cross-Origin Isolation is enabled. Booting WebContainer...');
            const webcontainerInstance = await WebContainer.boot();
            console.log('WebContainer booted successfully!');
            setWebcontainer(webcontainerInstance);
            setError(null);
        } catch (err) {
            console.error('Error initializing WebContainer:', err);
            // Check if the error is related to SharedArrayBuffer
            if (err instanceof Error && 
                (err.message.includes('SharedArrayBuffer') || 
                 err.message.includes('crossOriginIsolated'))) {
                setError(
                    'WebContainer requires Cross-Origin Isolation to be enabled. ' +
                    'This feature is not available in the current environment.'
                );
            } else {
                setError(`Failed to initialize WebContainer: ${err instanceof Error ? err.message : String(err)}`);
            }
        } finally {
            setIsInitializing(false);
        }
    }

    useEffect(() => {
        main();
        
        return () => {
            // Cleanup if needed
        };
    }, [])

    return { webcontainer, error, isInitializing };
}