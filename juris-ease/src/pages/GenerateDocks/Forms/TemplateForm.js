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

    const verifyFuncs = (updatedForm) => {
        templates.map(template => {
            let keysFuncs = template?.keys?.filter(key => key.type === 'function');

            keysFuncs?.forEach(key => {
                const operation = key.function.operation;
                const params = []
                key.function.params.map(param => {
                    let value = param.startsWith('{{') ? updatedForm[param] : param
                    if (value) params.push(value)
                });

                let result;
                try {
                    result = functions[operation].execute(params);
                } catch (e) {
                    result = ''
                }

                updatedForm[key.id] = result
            });
        })
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
            if (['text', 'monetary', 'date', 'number', "hour"].includes(key.type)) {
                return (
                    <form className='form-group' key={key.id}>
                        <label htmlFor={key.id}>{key.id.replace(/[{}]/g, '')}:</label>
                        <input
                            type={key.type === 'monetary' || key.type === 'hour' ? 'text' : key.type}
                            id={key.id}
                            name={key.id}
                            value={form[key.id] || ''}
                            onBlur={e => handleBlur(e, key.type)}
                            onChange={handleChange}
                        />
                    </form>
                );
            }
            return null;
        })
    )
}

export default TemplateForm