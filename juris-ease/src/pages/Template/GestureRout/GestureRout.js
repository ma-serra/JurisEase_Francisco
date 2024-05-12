import './GestureRout.css'
import React from 'react';

function GestureRout({ rout, setRout }) {

    function handleRout(e, index) {
        e.preventDefault();
        const { value } = e.target;
    
        setRout(prevRout => {
            const updatedRout = [...(prevRout || [])];
            updatedRout[index] = value;
    
            return updatedRout;
        });
    }
    
    const handleAddRout = (e) => {
        e.preventDefault();
    
        setRout(prevRout => [...prevRout, '']);
    };
    
    const handleRemoveRout = (e, index) => {
        e.preventDefault();
    
        setRout(prevRout => {
            const updatedRout = [...prevRout];
            updatedRout.splice(index, 1);
    
            return updatedRout;
        });
    };

    return (
        <div className='field-array'>
            <p>Caminho:</p>
            {rout.map((routItem, index) => (
                <label key={`rout-${index}`} htmlFor={`rout.${index}`} className='field-input rout-item'>
                    <input
                        type='text'
                        id={`rout.${index}`}
                        value={routItem || ""}
                        onChange={e => { handleRout(e, index) }}
                    />

                    <button className="bt-row" onClick={(e) => handleRemoveRout(e, index)}>-</button>
                    {rout.length === index + 1 && (
                        <button className="bt-row" onClick={handleAddRout}>+</button>
                    )}
                </label>
            ))}

            {rout.length === 0 && (
                <button className="bt-add" onClick={handleAddRout}>Adicionar Caminho</button>
            )}
        </div>
    )

}

export default GestureRout