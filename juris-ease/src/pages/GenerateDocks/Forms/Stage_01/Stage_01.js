import '../Stage.css'
import React, { useState } from 'react';

function Stage01() {
    const [form, setForm] = useState({
        nome_autor: '',
        nacionalidade: '',
        estado_civil: '',
        profissao: '',
        numero_CPF: '',
        numero_RG: '',
        orgao_expedidor_UF: '',
        endereco: '',
        telefone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <form className='form-stage'>
            <h2 className='title-form'>Dados do reclamante</h2>
            <div className='form-group'>
                <label htmlFor='nome_autor'>Nome do autor:</label>
                <input type='text' id='nome_autor' name='nome_autor' value={form.nome_autor} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='nacionalidade'>Nacionalidade:</label>
                <input type='text' id='nacionalidade' name='nacionalidade' value={form.nacionalidade} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='estado_civil'>Estado Civil:</label>
                <input type='text' id='estado_civil' name='estado_civil' value={form.estado_civil} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='profissao'>Profissão:</label>
                <input type='text' id='profissao' name='profissao' value={form.profissao} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='numero_CPF'>Número CPF:</label>
                <input type='text' id='numero_CPF' name='numero_CPF' value={form.numero_CPF} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='numero_RG'>Número RG:</label>
                <input type='text' id='numero_RG' name='numero_RG' value={form.numero_RG} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='orgao_expedidor_UF'>Órgão expedidor / UF:</label>
                <input type='text' id='orgao_expedidor_UF' name='orgao_expedidor_UF' value={form.orgao_expedidor_UF} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='endereco'>Endereço:</label>
                <input type='text' id='endereco' name='endereco' value={form.endereco} onChange={handleChange} />
            </div>
            <div className='form-group'>
                <label htmlFor='telefone'>Telefone:</label>
                <input type='text' id='telefone' name='telefone' value={form.telefone} onChange={handleChange} />
            </div>
        </form>
    );
}

export default Stage01;
