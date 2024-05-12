import './GestureKeys.css'
import React from 'react';
import KeyForm from './KeyForm';

function GestureKeys({ keys, setKeys }) {

    const handleAddKey = (e) => {
        e.preventDefault();

        setKeys(prevKeys => {
            const newKey = { id: '', type: 'text' };
            return [...prevKeys, newKey];
        });
    };

    const handleRemoveKey = (index) => {
        setKeys(prevKeys => {
            const updatedKeys = [...prevKeys];
            updatedKeys.splice(index, 1);
            return updatedKeys;
        });
    };

    function autoGenerateKeys() {
        console.log("autoGenerateKeys")
    }

    return (
        <div className='field-array'>
            <p className='field-title'>Chaves do Documento:</p>

            {keys.map((key, index) => (
                <KeyForm key={index} keyData={key} index={index} setKeys={setKeys} onRemove={handleRemoveKey}/>
            ))}

            <button className="bt-add" onClick={handleAddKey}>Adicionar Chave</button>
            <button type="button" className="bt-add bt-auto-generate" onClick={autoGenerateKeys}>Auto generate</button>
        </div>
    )

}

export default GestureKeys