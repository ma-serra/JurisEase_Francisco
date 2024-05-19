import '../Stage.css'
import React, { useEffect } from 'react';
import TemplateForm from '../TemplateForm';

function Stage04({ form, setForm, templateBase }) {

    useEffect(() => {
        setForm(prevForm => ({
            ...prevForm,
            '{{cidade_uf_vara_trabalho}}': form['{{cidade_uf_vara_trabalho}}'] || '',
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    return (
        <div className='form-stage'>
            <h2 className='title-form'>Vara do Trabalho (competência)</h2>
            <div className='form-group'>
                <label htmlFor='{{cidade_uf_vara_trabalho}}'>Cidade/UF</label>
                <input type='text' id='{{cidade_uf_vara_trabalho}}' name='{{cidade_uf_vara_trabalho}}' value={form['{{cidade_uf_vara_trabalho}}'] || ''} onChange={handleChange} />
            </div>

            <h2 className='title-form'>Dados extras</h2>
            <TemplateForm templates={[templateBase]} templateForm={templateBase} form={form} setForm={setForm} />
        </div>
    );
}

export default Stage04;