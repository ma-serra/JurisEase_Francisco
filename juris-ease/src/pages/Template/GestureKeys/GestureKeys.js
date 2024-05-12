import './GestureKeys.css'
import React from 'react';
import KeyForm from './KeyForm';
import { autoGenerateKeys } from '../FormTemplate/AutoGenerateKeys';

function GestureKeys({ keys, setKeys, errors, contents }) {

    const handleAddKey = (e) => {
        e.preventDefault();

        setKeys(prevKeys => {
            const newKey = { id: '', type: 'text' };
            return [...prevKeys, newKey];
        });
    };

    const handleRemoveKey = (e, index) => {
        e.preventDefault()

        setKeys(prevKeys => {
            const updatedKeys = [...prevKeys];
            updatedKeys.splice(index, 1);
            return updatedKeys;
        });
    };

    function onAutoGenerate(e) {
        e.preventDefault()

        const newKeys = autoGenerateKeys(keys, contents)
        setKeys(newKeys)
    }

    return (
        <div className='field-array'>
            <p className='field-title'>Chaves do Documento:</p>

            {keys.map((key, index) => (
                <KeyForm key={index} keyData={key} index={index} setKeys={setKeys} onRemove={e => handleRemoveKey(e, index)}/>
            ))}
            <p className='erro-message'>{errors}</p>

            <button className="bt-add" onClick={handleAddKey}>Adicionar Chave</button>
            <button type="button" className="bt-add bt-auto-generate" onClick={e => onAutoGenerate(e)}>Auto generate</button>
        </div>
    )

}

export default GestureKeys