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
            const params = []
            key.function.params.map(param => {
                const value = updatedForm[param]
                if (value) {
                    params.push(value)
                }
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
        const { name, value } = e.target;
        const formattedValue = type === 'monetary' ? formatMonetary(value) : formatHour(value);
        setForm(prevForm => ({
            ...prevForm,
            [name]: formattedValue
        }));
    };

    // Função para formatar o valor monetário, se necessário
    const formatMonetary = (value) => {
        if (value && !/^R\$ \d+(\,\d{2})?$/.test(value)) {
            // Remove todos os caracteres que não são dígitos ou vírgulas e converte para float
            const numberValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
            if (!isNaN(numberValue)) {
                return `R$ ${numberValue.toFixed(2).replace('.', ',')}`;
            }
        }
        return value || '';
    };

    const formatHour = (value) => {
        // 1. deve ter tamanho minimo de 3 caracters
        // 2. identificar se só possui numeros e somente 1 caracter ':' (o caracter ':' é opcional, porem só pode haver 1 )
        // 3. se tiver ':' deve ter 2 numeros seguidos
        // 4. pegar os minutos, sempre será os 2 ultimos digitos, se for maior que 60 converter em horas e minutos
        // 5. pegar as horas, todos os outros numeros restantes e somar as horas extras
        // 6. gerar o retorno horas:minutos

        // 1
        if (value.length < 3) {
            return ''
        }

        // 2
        if (!/^\d+(?::\d+)?$/.test(value)) {
            return ''
        }

        // 3 
        if (value.includes(':') && !/\d{2}$/.test(value.split(':')[1])) {
            return ''
        }

        // 4
        let minutes = value.substring(value.length - 2, value.length)
        let extraHours = 0
        minutes = parseInt(minutes)

        // Se os minutos forem maiores que 60, converter em horas e ajustar os minutos restantes
        if (minutes >= 60) {
            extraHours = Math.floor(minutes / 60);
            minutes %= 60; // Ajustar os minutos restantes
        }

        // Extrair as horas (todos os outros números)
        let hours = parseInt(value.replace(/\D/g, '').slice(0, -2), 10) + extraHours;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
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
