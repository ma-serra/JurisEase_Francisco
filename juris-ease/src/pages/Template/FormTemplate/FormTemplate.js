import './FormTemplate.css'

import React, { useEffect, useState } from 'react';
import MyEditor from '../../../components/MyEditor/MyEditor';
import GestureKeys from '../GestureKeys/GestureKeys';
import GestureRout from '../GestureRout/GestureRout';

function FormTemplate({ type, template, setTemplate }) {

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
                    className="form-template__input"
                />
            </label>

            {type === "base" && (
                <div className='base-section'>
                    <div className='field-editor'>
                        <p>Corpo:</p>
                        <MyEditor data={template.contents.base} onDataChange={(content) => { setDataTo("base", content) }} />
                    </div>

                    <label htmlFor='typeTermination' className="field-input">
                        <p className='field-title'>Tipo de recisão:</p>
                        <select
                            id='typeTermination'
                            value={template?.typeTermination}
                            onChange={handleChange}
                        >
                            <option value=''>Selecione</option>
                            <option value='Pedido de demissão'>Pedido de demissão</option>
                            <option value='Demissão sem justa causa'>Demissão sem justa causa</option>
                            <option value='Demissão por justa causa'>Demissão por justa causa</option>
                        </select>
                    </label>

                    <label htmlFor='numberOfComplaints' className="field-input">
                        <p className='field-title'>Numero de reclamadas:</p>
                        <input
                            type='number'
                            id='numberOfComplaints'
                            value={template?.numberOfComplaints || 0}
                            onChange={handleChange}
                            className="form-template__input"
                        />
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
                    </div>


                    <div className='field-editor'>
                        <p className='field-title'>Fundamentos:</p>
                        <MyEditor data={template.contents.fundamentos} onDataChange={(content) => { setDataTo("fundamentos", content) }} />
                    </div>

                    <div className='field-editor'>
                        <p className='field-title'>Pedidos:</p>
                        <MyEditor data={template.contents.pedidos} onDataChange={(content) => { setDataTo("pedidos", content) }} />
                    </div>

                    <GestureRout rout={rout} setRout={setRout}/>
                </div>
            )}

            <GestureKeys keys={keys} setKeys={setKeys}/>
        </form>
    );
}

export default FormTemplate;
