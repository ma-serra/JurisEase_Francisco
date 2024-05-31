import './ManagmentForms.css'
import React, { useEffect, useState } from 'react';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import TemplateForm from '../../TemplateForm';

function ManagmentForms({ form, setForm, templates, templateBase, currentIndex, setCurrentIndex }) {

    const [currentTemplate, setCurrentTemplate] = useState({});
    

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
        setCurrentTemplate(templates ? templates[currentIndex] : {});
    }, [currentIndex, templates]);

    return (
        <div className='forms-templates'>
            <div className='header'>
                <button className='next-form' onClick={handleBack}>
                    <SlArrowLeft />
                </button>
                <h2 className='title'>{currentTemplate?.title || "Selecione um template"}</h2>
                <button className='prev-form' onClick={handleNext}>
                    <SlArrowRight />
                </button>
            </div>

            <TemplateForm templates={[...templates, templateBase]} templateForm={currentTemplate}  form={form} setForm={setForm}/>
        </div>
    );
}

export default ManagmentForms;
