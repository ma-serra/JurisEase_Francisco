import React, { useEffect, useState } from 'react';
import { functions } from '../../../utils/tools/functions'
import GestureParams from '../GestureParams/GestureParams';

function KeyForm({ keyData, index, setKeys, onRemove }) {

    const [params, setParams] = useState(keyData.function?.params || [])

    const handleKey = (e) => {
        const { name, value } = e.target;

        setKeys(prevKeys => {
            const updatedKeys = [...prevKeys];
            updatedKeys[index][name] = value;
            return updatedKeys;
        });
    };

    const handleOperation = (e) => {
        const { name, value } = e.target;
        const manyParams = functions[value]?.manyParams || false;
    
        setKeys(prevKeys => {
            const updatedKeys = [...prevKeys];
            const keyToUpdate = { ...(updatedKeys[index] || {}) };
            const updatedFunction = { ...(keyToUpdate.function || {}) };
    
            updatedFunction[name] = value;
    
            if (!manyParams) {
                updatedFunction.params = Array.from({ length: functions[value]?.minParams }, () => "");
            } else {
                if (!updatedFunction.params) {
                    updatedFunction.params = [];
                }
            }
    
            keyToUpdate.function = updatedFunction;
            updatedKeys[index] = keyToUpdate;
            return updatedKeys;
        });
    
        if (!manyParams) {
            setParams(Array.from({ length: functions[value]?.minParams }, () => ""));
        }
    };
    

    useEffect(() => {
        setKeys(prevKeys => {
            const updatedKeys = [...prevKeys];
            const keyToUpdate = { ...(updatedKeys[index] || {}) };
            const updatedFunction = { ...(keyToUpdate.function || {}) };
            updatedFunction.params = params;
            keyToUpdate.function = updatedFunction;
            updatedKeys[index] = keyToUpdate;
            return updatedKeys;
        });
    }, [params])

    return (
        <div key={`key-${index}`} className='field-key'>
            <button className="bt-remove-key" onClick={e => onRemove(e, index)}>X</button>

            <div className='key-info'>

                <label htmlFor={`key.${index}.id`} className='field-input'>
                    <p className='field-title'>Identificador</p>
                    <input
                        type='text'
                        id={`key.${index}.id`}
                        name='id'
                        placeholder='Chave'
                        value={keyData?.id || ""}
                        onChange={e => { handleKey(e, index) }}
                    />
                </label>

                <label htmlFor={`key.${index}.type`} className='field-input'>
                    <p className='field-title'>Tipo</p>
                    <select
                        id={`key.${index}.type`}
                        name='type'
                        value={keyData.type}
                        onChange={e => { handleKey(e, index) }}
                    >
                        <option value='text'>Texto</option>
                        {keyData.type === 'base' && (<option value='fatos'>Fatos</option>)}
                        {keyData.type === 'base' && (<option value='fundamentos'>Fundamentos</option>)}
                        {keyData.type === 'base' && (<option value='pedidos'>Pedidos</option>)}
                        <option value='monetary'>Monetário</option>
                        <option value='date'>Data</option>
                        <option value='hour'>Hora</option>
                        <option value='number'>Numero</option>
                        <option value='function'>Função</option>
                    </select>
                </label>

                {keyData.type === "function" && (
                    <label htmlFor={`key.${index}.funcOp`} className='field-input'>
                        <p className='field-title'>Operação</p>
                        <select
                            id={`key.${index}.funcOp`}
                            name='operation'
                            value={keyData.function?.operation}
                            onChange={e => { handleOperation(e, index) }}
                        >
                            <option key={`key-${index}-selecione`} value={null}>Selecione</option>
                            {Object.entries(functions).map(([operation, { name }]) => (
                                <option key={`key-${index}-${name}`} value={operation}>{name}</option>
                            ))}
                        </select>
                    </label>
                )}
            </div>

            {keyData.type === "function" && (
                <GestureParams id={index} operation={keyData.function?.operation} params={params} setParams={setParams}/>
            )}
        </div>
    )
}

export default KeyForm