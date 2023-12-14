import React, { useEffect, useRef } from 'react';
import pdfjs from 'pdfjs-dist';

function PDFViewer({ pdfUrl }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    const loadingTask = pdfjs.getDocument(pdfUrl);

    loadingTask.promise
      .then((pdfDocument) => {
        // Pilih halaman pertama dari dokumen PDF
        return pdfDocument.getPage(1);
      })
      .then((page) => {
        const viewport = page.getViewport({ scale: 1 });
        const canvasContext = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Render halaman PDF ke elemen <canvas>
        page.render({ canvasContext, viewport });
      })
      .catch((error) => {
        console.error('Error loading PDF:', error);
      });
  }, [pdfUrl]);

  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default PDFViewer;
