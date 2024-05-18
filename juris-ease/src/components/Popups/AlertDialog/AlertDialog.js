import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import './AlertDialog.css';

const AlertDialog = ({ message, onConfirm, onCancel }) => {
    return createPortal(
        <div className="alert-dialog-overlay">
            <div className="alert-dialog">
                <div className="alert-dialog-message" dangerouslySetInnerHTML={{ __html: message }} />
                <div className="alert-dialog-buttons">
                    <button className="confirm" onClick={onConfirm}>Confirmar</button>
                    <button className="cancel" onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>,
        document.getElementById('alert-dialog-container')
    );
};

let root;

AlertDialog.show = (message, onConfirm, onCancel) => {
    const handleConfirm = () => {
        onConfirm();
        hide();
    };

    const handleCancel = () => {
        onCancel();
        hide();
    };

    if (!root) {
        root = createRoot(document.getElementById('alert-dialog-container'));
    }

    root.render(
        <AlertDialog
            message={message}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );
};

function hide() {
    if (root) {
        root.unmount();
        root = null; // Limpar a referência para permitir a criação de uma nova raiz se necessário
    }
}

export default AlertDialog;
