import React, { useState } from 'react';
import '../Stage.css';

function Stage02() {
    const [reclamadas, setReclamadas] = useState([
        {
            nome: '',
            tipo_empresa: 'Principal',
            num_cpf_cnpj: '',
            endereco: ''
        }
    ]);

    const handleAddReclamada = () => {
        const newId = reclamadas.length + 1;
        const newReclamada = {
            id: newId,
            nome: '',
            tipo_empresa: 'Selecione',
            num_cpf_cnpj: '',
            endereco: ''
        };
        setReclamadas([...reclamadas, newReclamada]);
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        console.log(name, value, index)
        const att = name.split('.')[0]

        const updatedReclamadas = reclamadas.map((reclamada, idx) => {
            if (idx === index) {
                return { ...reclamada, [att]: value };
            }
            return reclamada;
        });
        setReclamadas(updatedReclamadas);
    };

    return (
        <form className='form-stage'>
            <h2 className='title-form'>Dados da Reclamada</h2>

            {reclamadas.map((reclamada, index) => (
                <div className='reclamada' key={index}>
                    <p>{`Reclamada 0${index+1}`}</p>
                    <div className='form-group'>
                        <label htmlFor={`nome.${index}`}>Razão Social / Nome:</label>
                        <input type='text' id={`nome.${index}`} name={`nome.${index}`} value={reclamada.nome} onChange={e => handleChange(e, index)} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor={`tipo_empresa.${index}`}>Tipo de Empresa:</label>
                        <select id={`tipo_empresa.${index}`} name={`tipo_empresa.${index}`} value={reclamada.tipo_empresa} onChange={e => handleChange(e, index)}>
                            {index === 0 && (<option value='Principal'>Principal</option>)}
                            {index !== 0 && (<option value='Solidária'>Solidária</option>)}
                            {index !== 0 && (<option value='Subsidiária'>Subsidiária</option>)}
                        </select>
                    </div>
                    <div className='form-group'>
                        <label htmlFor={`num_cpf_cnpj.${index}`}>Número CNPJ / CPF:</label>
                        <input type='text' id={`num_cpf_cnpj.${index}`} name={`num_cpf_cnpj.${index}`} value={reclamada.num_cpf_cnpj} onChange={e => handleChange(e, index)} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor={`endereco.${index}`}>Endereço:</label>
                        <input type='text' id={`endereco.${index}`} name={`endereco.${index}`} value={reclamada.endereco} onChange={e => handleChange(e, index)} />
                    </div>
                </div>
            ))}

            <button className="bt-addreclamada" type="button" onClick={handleAddReclamada}>Adicionar nova reclamada</button>
        </form>
    );
}

export default Stage02;
