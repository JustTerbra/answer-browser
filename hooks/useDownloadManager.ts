
import { useEffect, useRef } from 'react';
import { useDownloadStore } from '../store/downloadStore';

const mockFileNames = [
  'project-assets.zip',
  'quarterly-report.docx',
  'team-photo.jpeg',
  'audio-driver-update.pkg',
  'presentation-deck.pptx',
];

const mockFileSizes = ['128.3 MB', '876 KB', '4.1 MB', '15.6 MB', '22.9 MB'];

// This hook simulates a download manager to provide visual feedback in the UI
export const useDownloadManager = () => {
  const { addDownload, updateDownload, downloads } = useDownloadStore.getState();
  const intervals = useRef<Map<string, number>>(new Map());

  // Effect to add a new mock download periodically
  useEffect(() => {
    const addNewDownloadInterval = window.setInterval(() => {
      if (downloads.filter(d => d.status === 'in-progress').length >= 2) return;

      const randomIndex = Math.floor(Math.random() * mockFileNames.length);
      addDownload({
        fileName: mockFileNames[randomIndex],
        url: `https://example.com/downloads/${mockFileNames[randomIndex]}`,
        size: mockFileSizes[randomIndex],
      });
    }, 10000); // Add a new download every 10 seconds

    return () => clearInterval(addNewDownloadInterval);
  }, []); // Run only once

  // Effect to manage the progress of 'in-progress' downloads
  useEffect(() => {
    const inProgressDownloads = downloads.filter(d => d.status === 'in-progress');

    inProgressDownloads.forEach(download => {
      // If an interval for this download doesn't exist, create one
      if (!intervals.current.has(download.id)) {
        const progressInterval = window.setInterval(() => {
          const currentDownload = useDownloadStore.getState().downloads.find(d => d.id === download.id);
          
          if (currentDownload && currentDownload.progress < 100) {
            const randomIncrement = Math.random() * 15;
            const newProgress = Math.min(currentDownload.progress + randomIncrement, 100);
            
            if (newProgress >= 100) {
              updateDownload(download.id, { progress: 100, status: 'completed' });
              clearInterval(progressInterval);
              intervals.current.delete(download.id);
            } else {
              updateDownload(download.id, { progress: newProgress });
            }
          } else {
            // Cleanup if download is no longer 'in-progress' for any reason
            clearInterval(progressInterval);
            intervals.current.delete(download.id);
          }
        }, 500); // Update progress every 500ms
        
        intervals.current.set(download.id, progressInterval);
      }
    });

    // Cleanup: clear intervals for downloads that are no longer in progress
    intervals.current.forEach((intervalId, downloadId) => {
        const isStillInProgress = downloads.some(d => d.id === downloadId && d.status === 'in-progress');
        if(!isStillInProgress) {
            clearInterval(intervalId);
            intervals.current.delete(downloadId);
        }
    });

    return () => {
      intervals.current.forEach(intervalId => clearInterval(intervalId));
    };
  }, [downloads]); // Re-run whenever downloads array changes
};
