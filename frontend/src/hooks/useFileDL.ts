import { useState } from "react";
import { CancelablePromise } from "../client"
import { AxiosError } from "axios";

function useFileDL () {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const FileDownload = async (filePromise:CancelablePromise<any>, fileName: string) => {
        try {
          
            setLoading(true)
            setError(null)
            
            // Wait for the promise to resolve and get the file data
            const fileData = await filePromise;
            console.log(fileData.length)
            // Create a blob from the file data
            const blob = new Blob([fileData], { type: 'application/octet-stream' });
            
            // Create a link element and trigger the download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", fileName)
            document.body.appendChild(link);
            link.click();
            
            // Clean up the link after the download starts
            document.body.removeChild(link);
        } catch (err: AxiosError | any) {
            console.log(err.message)
            setError(err.message || 'Failed to download file');
        } finally {
            setLoading(false)
        }
    }
    

    return {FileDownload, error, loading}
}

export default useFileDL;
