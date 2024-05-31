import React from "react";
import { functions } from "../../../utils/tools/functions";
import { formatHour, formatMonetary } from "../../../utils/tools/mask";
import { verifyFuncs } from "../../../utils/tools/tools";

function TemplateForm({ templates, templateForm, form, setForm }) {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => {
            const updatedForm = {
                ...prevForm,
                [name]: value
            };

            // Chamando verifyFuncs após atualizar o estado do formulário
            verifyFuncs(templates, updatedForm);
            return updatedForm;
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
            verifyFuncs(templates, updatedForm);
            return updatedForm;
        });
    };

    return (
        templateForm?.keys?.map(key => {
            if (['text', 'monetary', 'date', 'number', "hour"].includes(key.type)) {
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