// Test.js
import React, { useState } from 'react';
import { modifyPDF } from './DocsUtils';

const Test = () => {
  const [file, setFile] = useState(null);
  const [pdfContent, setPdfContent] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setPdfContent(null);
  };

  const readAndModifyPDF = async () => {
    try {
      if (!file) {
        console.error('Nenhum arquivo selecionado.');
        return;
      }

      console.log('file:', file)
      
      const valueMap = {
        nome: 'Andrew',
        idade: '12',
        a: 'A',
        b: 'B',
      };

      const modifiedPdfBytes = await modifyPDF(file, valueMap);
      setPdfContent(modifiedPdfBytes);
    } catch (error) {
      console.error('Erro ao modificar o PDF:', error.message);
    }
  };

  const handleUpload = async () => {
    if (pdfContent) {
      const formData = new FormData();
      formData.append('file', new Blob([pdfContent], { type: 'application/pdf' }), 'modified_file.pdf');

      // Substitua a URL abaixo pela sua API de upload
      const uploadUrl = 'https://sua-api-de-upload';

      try {
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          console.log('Upload bem-sucedido!');
        } else {
          console.error('Falha no upload:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
      }
    } else {
      console.error('Nenhum PDF modificado disponível para upload.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={readAndModifyPDF}>
        Modificar PDF
      </button>
      {pdfContent && (
        <>
          <h2>PDF Modificado</h2>
          <iframe
            title="PDF Viewer"
            src={`data:application/pdf;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(pdfContent)))}`}
            width="600"
            height="400"
          />
          <button onClick={handleUpload}>Fazer Upload do PDF Modificado</button>
        </>
      )}
    </div>
  );
};

export default Test;
