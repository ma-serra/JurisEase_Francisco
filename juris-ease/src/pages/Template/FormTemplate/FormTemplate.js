import './FormTemplate.css'

import React, { useEffect, useState } from 'react';
import MyEditor from '../../../components/MyEditor/MyEditor';
import GestureKeys from '../GestureKeys/GestureKeys';
import GestureRout from '../GestureRout/GestureRout';
import { autoGenerateKeys } from './AutoGenerateKeys'

function FormTemplate({ type, template, setTemplate, errors }) {

    const [keys, setKeys] = useState(template.keys)
    const [rout, setRout] = useState(template.rout)

    function setDataTo(data, content) {
        setTemplate((prevState) => ({
            ...prevState,
            contents: {
                ...prevState.contents,
                [data]: content
            }
        }));
    }

    function handleChange(e) {
        e.preventDefault();
        const { id, value } = e.target;

        setTemplate(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    function handleReclamada(e, index) {
        e.preventDefault();
        const { value } = e.target;

        setTemplate(prevState => {
            const updatedTypesResponsibilities = [...prevState.typesResponsibilities || []];
            updatedTypesResponsibilities[index] = value;

            return {
                ...prevState,
                typesResponsibilities: updatedTypesResponsibilities
            };
        });
    }

    useEffect(() => {
        setTemplate(prevState => {
            return {
                ...prevState,
                keys: keys
            };
        });
    }, [keys])

    useEffect(() => {
        setTemplate(prevState => {
            return {
                ...prevState,
                rout: rout
            };
        });
    }, [rout])
    
    return (
        <form className='form-template'>
            <label htmlFor='title' className="field-input">
                <p className='field-title'>Titulo:</p>
                <input
                    type='text'
                    id='title'
                    value={template?.title || ''}
                    onChange={handleChange}
                />
            <p className='erro-message'>{errors.title}</p>
            </label>

            {type === "base" && (
                <div className='base-section'>
                    <div className='field-editor'>
                        <p>Corpo:</p>
                        <MyEditor data={template.contents.base} onDataChange={(content) => { setDataTo("base", content) }} />
                    <p className='erro-message'>{errors.contents}</p>
                    </div>

                    <label htmlFor='typeTermination' className="field-input">
                        <p className='field-title'>Tipo de recisão:</p>
                        <select
                            id='typeTermination'
                            value={template?.typeTermination}
                            onChange={handleChange}
                        >
                            <option value=''>Selecione</option>
                            <option value='a pedido'>a pedido</option>
                            <option value='sem justa causa'>sem justa causa</option>
                            <option value='por justa causa'>por justa causa</option>
                            <option value='por término do prazo contratual'>por término do prazo contratual</option>
                        </select>
                    <p className='erro-message'>{errors.typeTermination}</p>
                    </label>

                    <label htmlFor='numberOfComplaints' className="field-input">
                        <p className='field-title'>Numero de reclamadas:</p>
                        <input
                            type='number'
                            id='numberOfComplaints'
                            value={template?.numberOfComplaints || 0}
                            onChange={handleChange}
                        />
                    <p className='erro-message'>{errors.numberOfComplaints}</p>
                    </label>

                    {template.numberOfComplaints && (
                        <div className='field-array'>
                            <p className='field-title'>Tipos de responsabilidades:</p>
                            {Array.from({ length: template.numberOfComplaints }, (_, index) => (
                                <label key={`tr-${index}`} htmlFor={`typesResponsibilities.${index}`} className="field-input">
                                    <p className='field-title'>{`Reclamada ${index + 1}`}</p>
                                    <select
                                        id={`typesResponsibilities.${index}`}
                                        value={template.typesResponsibilities?.[index]}
                                        onChange={e => { handleReclamada(e, index) }}
                                        disabled={index === 0}
                                    >
                                        {index === 0 && (<option value='Principal'>Principal</option>)}
                                        <option value=''>Selecione</option>
                                        <option value='Solidária'>Solidária</option>
                                        <option value='Subsidiária'>Subsidiária</option>
                                    </select>
                                    <p className='erro-message'>{errors.typesResponsibilities}</p>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {type === "specific" && (
                <div className='specific-section'>
                    <div className='field-editor'>
                        <p className='field-title'>Fatos:</p>
                        <MyEditor data={template.contents.fatos} onDataChange={(content) => { setDataTo("fatos", content) }} />
                    <p className='erro-message'>{errors.contents}</p>
                    </div>

                    <div className='field-editor'>
                        <p className='field-title'>Fundamentos:</p>
                        <MyEditor data={template.contents.fundamentos} onDataChange={(content) => { setDataTo("fundamentos", content) }} />
                    <p className='erro-message'>{errors.contents}</p>
                    </div>

                    <div className='field-editor'>
                        <p className='field-title'>Pedidos:</p>
                        <MyEditor data={template.contents.pedidos} onDataChange={(content) => { setDataTo("pedidos", content) }} />
                    <p className='erro-message'>{errors.contents}</p>
                    </div>

                    <GestureRout rout={rout} setRout={setRout} errors={errors.rout}/>
                </div>
            )}

            <GestureKeys keys={keys} setKeys={setKeys} errors={errors.keys} contents={template.contents}/>
        </form>
    );
}

export default FormTemplate;
