import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import Swal from 'sweetalert2';
import { Button } from 'primereact/button';
import 'react-pdf/dist/esm/Page/TextLayer.css'; // Gaya untuk TextLayer

function PDFViewer({ pdfUrl }) {
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < numPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    useEffect(() => {
        const loadPdf = async () => {
            try {
                const loadingTask = pdfjs.getDocument({ url: pdfUrl });
                const pdf = await loadingTask.promise;
                const pages = pdf.numPages;
                setNumPages(pages);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error loading PDF: ' + error.message
                });
            }
        };

        if (pdfUrl) {
            loadPdf();
        }
    }, [pdfUrl]);

    return (
        <div>
            {pdfUrl && numPages !== null && (
                <div>
                    <div className="pdf-container">
                        <div className="pdf-nav" style={{ marginTop: '10px' }}>
                            <Button label="Previous Page" icon="pi pi-chevron-left" onClick={handlePrevPage} disabled={currentPage === 1} className="p-button-rounded p-button-text p-button-outlined" />
                            <span className="pdf-nav-page">
                                Page {currentPage} of {numPages}
                            </span>
                            <Button label="Next Page" icon="pi pi-chevron-right" onClick={handleNextPage} disabled={currentPage === numPages} className="p-button-rounded p-button-text p-button-outlined" />
                        </div>
                        <div className="pdf-frame" style={{ marginTop: '10px', border: '1px solid #ccc', padding: '0px', width: '100%', height: '40vh', overflow: 'auto' }}>
                            <Document file={pdfUrl}>
                                <Page pageNumber={currentPage} />
                            </Document>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PDFViewer;
