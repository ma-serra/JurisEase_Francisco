import './ManagmentForms.css'
import React, { useEffect, useState } from 'react';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { functions } from '../../../../../utils/tools/functions';
import { formatHour, formatMonetary } from '../../../../../utils/tools/mask';

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
        setForm(prevForm => {
            const updatedForm = {
                ...prevForm,
                [name]: value
            };

            // Chamando verifyFuncs após atualizar o estado do formulário
            verifyFuncs(updatedForm);
            return updatedForm;
        });
    };

    const verifyFuncs = (updatedForm) => {
        let keysFuncs = currentTemplate?.keys?.filter(key => key.type === 'function');

        keysFuncs?.forEach(key => {
            const operation = key.function.operation;
            const params = []
            key.function.params.map(param => {
                let value = param.startsWith('{{') ? updatedForm[param] : param
                if (value?.trim()) params.push(value?.trim())
            });

            let result;
            try {
                result = functions[operation].execute(params);
            } catch (e) {
                result = ''
            }

            updatedForm[key.id] = result
        });
    };

    const renderForm = () => {
        return (
            currentTemplate?.keys && currentTemplate.keys.map(key => {
                if (['text', 'monetary', 'date', 'number', "hour"].includes(key.type)) {
                    return (
                        <div className='form-group' key={key.id}>
                            <label htmlFor={key.id}>{key.id.replace(/[{}]/g, '')}:</label>
                            <input
                                type={key.type === 'monetary' || key.type === 'hour' ? 'text' : key.type}
                                id={key.id}
                                name={key.id}
                                value={form[key.id] || ''}
                                onBlur={e => handleBlur(e, key.type)}
                                onChange={handleChange}
                            />
                        </div>
                    );
                }
                return null;
            })
        );
    };

    // Função para tratar o onBlur e formatar o valor monetário ou hora, se necessário
    const handleBlur = (e, type) => {
        if (type === 'text') return
        if (type === 'number') return
        if (type === 'date') return

        const { name, value } = e.target;
        let formattedValue;
        if (type === 'monetary') {
            formattedValue = formatMonetary(value)
        } else if (type === 'hour') {
            formattedValue = formatHour(value)
        }

        setForm(prevForm => {
            const updatedForm = {
                ...prevForm,
                [name]: formattedValue
            };

            // Chamando verifyFuncs após atualizar o estado do formulário
            verifyFuncs(updatedForm);
            return updatedForm;
        });
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
