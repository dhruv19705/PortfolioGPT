'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, File, ExternalLink, Maximize2, X } from 'lucide-react';
import { resumeDetails } from '@/lib/config-loader';

interface ResumeProps {
  embedded?: boolean;
}

export function Resume({ embedded = false }: ResumeProps) {
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(true);
  const [isCheckingPreview, setIsCheckingPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const iframeSource = useMemo(() => {
    const url = resumeDetails.downloadUrl?.trim();
    if (!url) return '';

    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
    if (driveMatch?.[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }

    const isPdf = /\.pdf(\?|#|$)/i.test(url);
    const isRelative = url.startsWith('/');
    if (isPdf || isRelative) return url;

    return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(url)}`;
  }, []);

  useEffect(() => {
    const checkPreview = async () => {
      const url = resumeDetails.downloadUrl?.trim();
      if (!url) {
        setIsPreviewAvailable(false);
        setIsCheckingPreview(false);
        return;
      }

      if (url.startsWith('/')) {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          setIsPreviewAvailable(response.ok);
        } catch {
          setIsPreviewAvailable(false);
        } finally {
          setIsCheckingPreview(false);
        }
        return;
      }

      setIsPreviewAvailable(true);
      setIsCheckingPreview(false);
    };

    checkPreview();
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFullscreen]);

  const handleDownload = () => {
    if (!resumeDetails.downloadUrl) return;
    window.open(resumeDetails.downloadUrl, '_blank');
  };

  const previewHeightClass = embedded
    ? 'h-[calc(100dvh-var(--chat-chrome,7.5rem))] min-h-[360px]'
    : 'h-[600px]';

  const renderPreviewContent = () => {
    if (isCheckingPreview) {
      return (
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          Checking resume preview...
        </div>
      );
    }

    if (isPreviewAvailable && iframeSource) {
      return (
        <iframe
          src={iframeSource}
          width="100%"
          height="100%"
          className="border-0"
          title="Resume Preview"
        />
      );
    }

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-base font-medium text-gray-800 dark:text-gray-200">
          Resume preview is not available yet.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add your PDF to `public/` and set `resume.downloadUrl` in
          `portfolio-config.json` (example: `/my-resume.pdf`), or use a direct
          public PDF URL.
        </p>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-700"
        >
          <ExternalLink className="h-3 w-3" />
          Open Resume Link
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        className={`mx-auto w-full font-sans ${embedded ? 'py-2' : 'py-8'}`}
      >
        <motion.div
          className={`group relative overflow-hidden rounded-xl bg-accent p-0 transition-all duration-300 ${embedded ? 'mb-2' : 'mb-4'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.0, ease: 'easeOut' }}
        >
          <div className={embedded ? 'p-3' : 'p-5'}>
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`font-medium text-foreground ${embedded ? 'text-base' : 'text-lg'}`}
                >
                  {resumeDetails.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {resumeDetails.description}
                </p>
                <div className="mt-1 flex text-xs text-muted-foreground">
                  <span>{resumeDetails.fileType}</span>
                  <span className="mx-2">•</span>
                  <span>Updated {resumeDetails.lastUpdated}</span>
                  <span className="mx-2">•</span>
                  <span>{resumeDetails.fileSize}</span>
                </div>
              </div>

              <motion.button
                onClick={handleDownload}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/80"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Download PDF"
              >
                <Download className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full overflow-hidden rounded-xl border bg-card shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Resume Preview
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isPreviewAvailable && iframeSource && (
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1 text-xs text-white transition-colors hover:bg-blue-700"
                >
                  <Maximize2 className="h-3 w-3" />
                  Expand
                </button>
              )}
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1 text-xs text-foreground transition-colors hover:bg-muted"
              >
                <ExternalLink className="h-3 w-3" />
                Download
              </button>
            </div>
          </div>

          <div className={`w-full bg-muted ${previewHeightClass}`}>
            {renderPreviewContent()}
          </div>
        </motion.div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background">
          <div className="flex shrink-0 items-center justify-between border-b border-border bg-muted px-4 py-3">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {resumeDetails.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-blue-700"
              >
                <Download className="h-3 w-3" />
                Download
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-muted"
                aria-label="Close fullscreen"
              >
                <X className="h-3 w-3" />
                Close
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 bg-muted">
            {isPreviewAvailable && iframeSource ? (
              <iframe
                src={iframeSource}
                width="100%"
                height="100%"
                className="h-full border-0"
                title="Resume Preview Fullscreen"
              />
            ) : (
              renderPreviewContent()
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Resume;
