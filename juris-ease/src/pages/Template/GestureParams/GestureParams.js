import './GestureParams.css'
import React, { useEffect } from 'react';
import { functions } from '../../../utils/tools/functions'

function GestureParams({ id, operation, params, setParams }) {

    const handleParam = (e, paramIndex) => {
        e.preventDefault()
        const { value, name } = e.target;

        setParams(prevKeys => {
            const updatedParams = [...prevKeys];
            updatedParams[paramIndex][name] = value
            return updatedParams;
        });
    };

    const handleAddParam = (e) => {
        e.preventDefault();

        setParams(prevParams => {
            const newParam = {type: 'key', value: ''};
            return [...prevParams, newParam];
        });
    };

    const handleRemoveParam = (e, index) => {
        e.preventDefault();

        setParams(prevParams => {
            const updatedParams = [...prevParams];
            updatedParams.splice(index, 1);
            return updatedParams;
        });
    };

    const renderParams = () => {
        const manyParams = functions[operation]?.manyParams || false
        const minParams = functions[operation]?.minParams

        return params?.map((param, paramIndex) => (
            <div key={`key-${id}-paramFunc-${paramIndex}`} className='params-section'>
                <select
                    name='type'
                    value={param.type || "key"}
                    onChange={e => { handleParam(e, paramIndex) }}
                >
                    <option value='key'>Chave</option>
                    <option value='value'>Valor</option>
                    {manyParams && <option value='contains'>Chaves que contém</option>}
                    {manyParams &&<option value='start with'>Chaves que iniciam</option>}
                    {manyParams &&<option value='end with'>Chaves que terminam</option>}
                </select>
                <input
                    type='text'
                    name='value'
                    placeholder={param.name || `Parâmetro ${paramIndex + 1}`}
                    value={param.value || ""}
                    onChange={e => handleParam(e, paramIndex)}
                />
                {manyParams && paramIndex >= minParams && (
                    <button className='bt-remove-param' onClick={e => handleRemoveParam(e, paramIndex)}>-</button>
                )}
            </div>
        ));
    };

    return (
        <div className='function-section'>
            {functions[operation] && (
                <>
                    {renderParams()}
                    {functions[operation].manyParams && (
                        <button className='bt-add-param' onClick={handleAddParam}>Adicionar Parâmetro</button>
                    )}
                </>
            )}
        </div>
    );
}

export default GestureParams
