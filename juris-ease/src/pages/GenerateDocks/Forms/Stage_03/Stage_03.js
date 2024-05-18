import '../Stage.css'
import React, { useEffect } from 'react';

function Stage01({ form, setForm }) {

    useEffect(() => {
        setForm(prevForm => ({
            ...prevForm,
            '{{data_admisao}}': form['{{data_admisao}}'] || '',
            '{{data_rescisao}}': form['{{data_rescisao}}'] || '',
            '{{tipo_rescisao}}': form['{{tipo_rescisao}}'] || '',
            '{{cargo}}': form['{{cargo}}'] || '',
            '{{remuneracao}}': form['{{remuneracao}}'] || '',
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <form className='form-stage'>
            <h2 className='title-form'>Dados do contrato de trabalho</h2>
            <div className='form-group'>
                <label htmlFor='{{data_admisao}}'>Data de Admissão:</label>
                <input type='text' id='{{data_admisao}}' name='{{data_admisao}}' value={form['{{data_admisao}}'] || ''} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='{{data_rescisao}}'>Data de Recisão:</label>
                <input type='text' id='{{data_rescisao}}' name='{{data_rescisao}}' value={form['{{data_rescisao}}'] || ''} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='{{tipo_rescisao}}'>Tipo de Recisão:</label>
                <select id={`{{tipo_rescisao}}`} name={`{{tipo_rescisao}}`} value={form['{{tipo_rescisao}}']} onChange={handleChange}>
                    <option value=''>Selecione</option>
                    <option value='Pedido de demissão'>Pedido de demissão</option>
                    <option value='Demissão sem justa causa'>Demissão sem justa causa</option>
                    <option value='Demissão por justa causa'>Demissão por justa causa</option>
                </select>
            </div>
            <div className='form-group'>
                <label htmlFor='{{cargo}}'>Cargo:</label>
                <input type='text' id='{{cargo}}' name='{{cargo}}' value={form['{{cargo}}'] || ''} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='{{remuneracao}}'>Renumeração:</label>
                <input type='text' id='{{remuneracao}}' name='{{remuneracao}}' value={form['{{remuneracao}}'] || ''} onChange={handleChange} />
            </div>
        </form >
    );
}

export default Stage01;
