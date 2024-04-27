import './ManagmentForms.css'
import React, { useEffect, useState } from 'react';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { functions } from '../../../../../utils/tools/functions';

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
            const params = key.function.params.map(param => {
                return updatedForm[param] || param;
            });

            let result;
            try {
                result = functions[operation].execute(...params);
            } catch (e) {
                result = ''
            }

            updatedForm[key.id] = result
        });
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
                        onBlur={key.type === 'monetary' ? handleBlur : undefined}
                        onChange={handleChange}
                    />
                </div>
            ))
        );
    };
    
    // Função para tratar o onBlur e formatar o valor monetário, se necessário
    const handleBlur = (e) => {
        const { name, value } = e.target;
        const formattedValue = formatValue(value);
        setForm(prevForm => ({
            ...prevForm,
            [name]: formattedValue
        }));
    };
    
    // Função para formatar o valor monetário, se necessário
    const formatValue = (value) => {
        if (value && !/^R\$ \d+(\.\d{1,2})?$/.test(value)) {
            // Adiciona o símbolo de moeda e formata o valor para duas casas decimais
            return `R$ ${parseFloat(value).toFixed(2)}`;
        }
        return value || '';
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
