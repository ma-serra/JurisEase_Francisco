import '../Stage.css';
import React, { useEffect } from 'react';

import { MdDelete } from 'react-icons/md';


function Stage02({ form, setForm }) {
    useEffect(() => {
        setForm(prevForm => ({
            ...prevForm,
            reclamadas: prevForm.reclamadas || [
                {
                    '{{nome}}': '',
                    '{{tipo_responsabilidade}}': 'Principal',
                    '{{num_cpf_cnpj}}': '',
                    '{{endereco}}': ''
                }
            ],
        }));
    }, []);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const att = name.split('.')[0];

        const updatedReclamadas = (form.reclamadas || []).map((reclamada, idx) => {
            if (idx === index) {
                return { ...reclamada, [att]: value };
            }
            return reclamada;
        });
        setForm(prevForm => ({
            ...prevForm,
            reclamadas: updatedReclamadas
        }));
    };

    const handleAddReclamada = () => {
        const newId = (form.reclamadas || []).length + 1;
        const newReclamada = {
            id: newId,
            '{{nome}}': '',
            '{{tipo_responsabilidade}}': 'Selecione',
            '{{num_cpf_cnpj}}': '',
            '{{endereco}}': ''
        };
        setForm(prevForm => ({
            ...prevForm,
            reclamadas: [...(prevForm.reclamadas || []), newReclamada]
        }));
    };

    const handleDeleteReclamada = (id) => {
        setForm(prevForm => ({
            ...prevForm,
            reclamadas: (prevForm.reclamadas || []).filter(reclamada => reclamada.id !== id)
        }));
    };

    return (
        <form className='form-stage'>
            <h2 className='title-form'>Dados da Reclamada</h2>

            {(form.reclamadas || []).map((reclamada, index) => (
                <div className='reclamada' key={index}>
                    <MdDelete className='bt-delete' onClick={() => handleDeleteReclamada(reclamada.id)}/>
                    <p className='title'>{`Reclamada 0${index + 1}`}</p>
                    <div className='form-group'>
                        <label htmlFor={`{{nome}}.${index}`}>Razão Social / Nome:</label>
                        <input type='text' id={`{{nome}}.${index}`} name={`{{nome}}.${index}`} value={reclamada['{{nome}}'] || ''} onChange={e => handleChange(e, index)} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor={`{{tipo_responsabilidade}}.${index}`}>Tipo de Responsabilidade:</label>
                        <select id={`{{tipo_responsabilidade}}.${index}`} name={`{{tipo_responsabilidade}}.${index}`} value={reclamada['{{tipo_responsabilidade}}'] || ''} onChange={e => handleChange(e, index)}>
                            {index === 0 && (<option value='Principal'>Principal</option>)}
                            {index !== 0 && (<option value='Solidária'>Solidária</option>)}
                            {index !== 0 && (<option value='Subsidiária'>Subsidiária</option>)}
                        </select>
                    </div>
                    <div className='form-group'>
                        <label htmlFor={`{{num_cpf_cnpj}}.${index}`}>Número CNPJ / CPF:</label>
                        <input type='text' id={`{{num_cpf_cnpj}}.${index}`} name={`{{num_cpf_cnpj}}.${index}`} value={reclamada['{{num_cpf_cnpj}}'] || ''} onChange={e => handleChange(e, index)} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor={`{{endereco}}.${index}`}>Endereço:</label>
                        <input type='text' id={`{{endereco}}.${index}`} name={`{{endereco}}.${index}`} value={reclamada['{{endereco}}'] || ''} onChange={e => handleChange(e, index)} />
                    </div>
                </div>
            ))}

            <button className="bt-addreclamada" type="button" onClick={handleAddReclamada}>Adicionar nova reclamada</button>
        </form>
    );
}

export default Stage02;
