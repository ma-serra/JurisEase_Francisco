import React, { useEffect, useState } from 'react';

function ManagmentForms({ form, setForm, templates }) {

    const [currentTemplate, setCurrentTemplate] = useState({});

    const handleNext = () => {
        setCurrentTemplate();
    };

    const handleBack = () => {
        setCurrentTemplate();
    };

    const renderForm = () => {
        return (
            currentTemplate?.keys && currentTemplate.keys.map(key => {
                <h2>{currentTemplate.title}</h2>
                if (['text', 'monetary', 'date', 'number'].includes(key.type)) {
                    return (
                        <div className='form-group' key={key.id}>
                            <label htmlFor={key.id}>{key.id}:</label>
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
            })
        )
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    return (
        <div className='forms-templates'>
            {/* <div className='selection-form'>
                <button className='bt-prev' onAuxClick={handleBack}>
                    <p>Prev</p>
                </button>

                <button className='bt-next' onClick={handleNext}>
                    <p>Next</p>
                </button>
            </div>

            {renderForm()} */}
        </div>
    );
}

export default ManagmentForms;