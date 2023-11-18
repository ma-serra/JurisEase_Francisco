import './Test.css'
import React, { useCallback, createContext, useReducer } from 'react';
import { useDropzone } from 'react-dropzone';
import DocViewer from 'react-doc-viewer';

const Test = () => {
  const onDrop = useCallback((acceptedFiles) => {
    // Aqui você pode lidar com o arquivo enviado, por exemplo, enviá-lo para um servidor.
    console.log('Arquivo enviado:', acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
        <h1>Teste</h1>
      <div {...getRootProps()} style={dropzoneStyles}>
        <input {...getInputProps()} />
        <p>Arraste e solte um arquivo DOC aqui ou clique para selecionar.</p>
      </div>
    </div>
  );
};

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default Test;
