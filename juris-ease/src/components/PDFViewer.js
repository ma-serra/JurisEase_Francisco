import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

function PDFViewer({ pdfUrl }) {
    return (
        <div style={{ width: '100%', height: '500px' }}>
            <Worker workerUrl="/pdf.worker.min.js">
                <div style={{ height: '100%' }}>
                    <Viewer fileUrl={pdfUrl} />
                </div>
            </Worker>
        </div>
    );
}

export default PDFViewer;
