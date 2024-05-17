import './GestureParams.css'
import React, { useEffect } from 'react';
import { functions } from '../../../utils/tools/functions'

function GestureParams({ id, operation, params, setParams }) {

    const handleParamFunction = (e, paramIndex) => {
        const { value } = e.target;

        setParams(prevKeys => {
            const updatedParams = [...prevKeys];
            updatedParams[paramIndex] = value
            return updatedParams;
        });
    };

    const handleAddParam = (e) => {
        e.preventDefault();

        setParams(prevParams => {
            const newParam = "";
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

        return params.map((param, paramIndex) => (
            <div key={`key-${id}-paramFunc-${paramIndex}`} className='params-section'>
                <input
                    type='text'
                    placeholder={`Parâmetro ${paramIndex + 1}`}
                    value={param || ""}
                    onChange={e => handleParamFunction(e, paramIndex)}
                />
                {manyParams && (
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
