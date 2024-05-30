import React from "react";
import { functions } from "../../../utils/tools/functions";
import { formatHour, formatMonetary } from "../../../utils/tools/mask";

function TemplateForm({ templates, templateForm, form, setForm }) {

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

    const extractParamValues = (param, updatedForm) => {
        const values = [];
    
        if (param.type === 'value') {
            values.push(param.value);

        } else if (param.type === 'key') {
            const value = updatedForm[param.value];
            if (value) {
                values.push(value);
            }

        } else if (param.type === 'contains') {
            const keys = Object.keys(updatedForm).filter(k => k.includes(param.value));
            keys.forEach(k => {
                values.push(updatedForm[k]);
            });

        } else if (param.type === 'start with') {
            const keys = Object.keys(updatedForm).filter(k => k.startsWith(param.value));
            keys.forEach(k => {
                values.push(updatedForm[k]);
            });
            
        } else if (param.type === 'end with') {
            const keys = Object.keys(updatedForm).filter(k => k.endsWith(param.value));
            keys.forEach(k => {
                values.push(updatedForm[k]);
            });
        }
    
        return values;
    };
    
    const verifyFuncs = (updatedForm) => {
        templates.forEach(template => {
            const keysFuncs = template?.keys?.filter(key => key.type === 'function') || [];
            
            keysFuncs.forEach(key => {
                const { operation, params: paramList } = key.function;
                const params = [];

                paramList.forEach(param => {
                    const paramValues = extractParamValues(param, updatedForm);
                    params.push(...paramValues);
                });
    
                let result;
                try {
                    result = functions[operation].execute(params);
                } catch (e) {
                    result = '';
                }
    
                updatedForm[key.id] = result;
            });
        });
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
        templateForm?.keys?.map(key => {
            if (['text', 'monetary', 'date', 'number', "hour", 'function'].includes(key.type)) {
                return (
                    <div className='form-group' key={key.id}>
                        <label htmlFor={key.id}>{key.id}:</label>
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
    )
}

export default TemplateForm