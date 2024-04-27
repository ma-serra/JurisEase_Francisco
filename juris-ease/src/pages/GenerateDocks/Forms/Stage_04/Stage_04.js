import '../Stage.css'
import React, { useEffect, useState } from 'react';

function Stage04({ form, setForm, templateBase }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    return (
        <form className='form-stage'>
            <h2 className='title-form'>Dados extras</h2>
            {templateBase?.keys && templateBase.keys.map(key => {
                if (['text', 'monetary', 'date', 'number'].includes(key.type)) {
                    return (
                        <div className='form-group' key={key.id}>
                            <label htmlFor={key.id}>{key.id.replace(/[{}]/g, '')}:</label>
                            <input
                                type={key.type === 'monetary' ? 'text' : key.type}
                                id={key.id}
                                name={key.id}
                                value={form[key.id] || ''}
                                onChange={handleChange}
                            />
                        </div>
                    );
                }
                return null;
            })}
        </form>
    );
}

export default Stage04;