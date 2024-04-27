import '../Stage.css'
import React, { useEffect, useState } from 'react';

function Stage01({ form, setForm }) {

    useEffect(() => {
        setForm(prevForm => ({
            ...prevForm,
            '{{data_adimisao}}': form['{{data_adimisao}}'] || '',
            '{{data_recisao}}': form['{{data_recisao}}'] || '',
            '{{tipo_recisao}}': form['{{tipo_recisao}}'] || '',
            '{{cargo}}': form['{{cargo}}'] || '',
            '{{renumeracao}}': form['{{renumeracao}}'] || '',
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
                <label htmlFor='{{data_adimisao}}'>Data de Admissão:</label>
                <input type='text' id='{{data_adimisao}}' name='{{data_adimisao}}' value={form['{{data_adimisao}}'] || ''} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='{{data_recisao}}'>Data de Recisão:</label>
                <input type='text' id='{{data_recisao}}' name='{{data_recisao}}' value={form['{{data_recisao}}'] || ''} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='{{tipo_recisao}}'>Tipo de Recisão:</label>
                <select id={`{{tipo_recisao}}`} name={`{{tipo_recisao}}`} value={form['{{tipo_recisao}}']} onChange={handleChange}>
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
                <label htmlFor='{{renumeracao}}'>Renumeração:</label>
                <input type='text' id='{{renumeracao}}' name='{{renumeracao}}' value={form['{{renumeracao}}'] || ''} onChange={handleChange} />
            </div>
        </form >
    );
}

export default Stage01;
