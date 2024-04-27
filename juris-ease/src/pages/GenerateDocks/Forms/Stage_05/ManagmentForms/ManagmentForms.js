import './ManagmentForms.css'
import React, { useEffect, useState } from 'react';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

function ManagmentForms({ form, setForm, templates }) {

    const [currentTemplate, setCurrentTemplate] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < templates.length - 1) {
            setCurrentIndex(currentIndex => currentIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex => currentIndex - 1);
        }
    };

    useEffect(() => {
        setCurrentTemplate(templates[currentIndex] || {});
    }, [templates, currentIndex]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const renderForm = () => {
        return (
            currentTemplate?.keys && currentTemplate.keys.map(key => (
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
            ))
        );
    };

    return (
        <div className='forms-templates'>
            <div className='header'>
                <button className='next-form' onClick={handleBack}>
                    <SlArrowLeft />
                </button>
                <h2 className='title'>{currentTemplate.title}</h2>
                <button className='prev-form' onClick={handleNext}>
                    <SlArrowRight />
                </button>
            </div>

            {renderForm()}
        </div>
    );
}

export default ManagmentForms;
