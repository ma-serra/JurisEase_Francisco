import './DrawerTemplate.css'
import React, { useEffect, useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { addTemplate, removeTemplate } from '../../../utils/data_base/firebase/dao/templateDAO';
import { extractKeys } from '../../../utils/tools/tools';

function DrawerTemplate({ type, data }) {
    const [errorStatus, setErrorStatus] = useState(null);
    const [template, setTemplate] = useEffect(data || {
        title: "",
        rout: [],
        keys: [],
        contents: {
            base: "",
            fatos: "",
            fundamentos: "",
            pedidos: ""
        },
        typeTermination: "",
        numberOfComplaints: "",
        typesResponsibilities: []
    })

    // extremamente complexo e mal formatado
    const handleInputChange = (event) => {
        const { id, value } = event.target;

        setTemplate(prevState => {
            const formTemplate = { ...prevState };

            if (id.startsWith('rout.')) {
                const [, index] = id.split('.'); // rout.0
                formTemplate.rout[index] = value

            } else if (id.startsWith('keys.')) {
                const [, index, att, funcAtt, idFuncAtt] = id.split('.'); // keys.0.id-type-function

                if (att === "id" || att === "type") {
                    formTemplate.keys[index][att] = value
                }

                if (att === "function") {
                    if (!formTemplate.keys[index][att]) {
                        formTemplate.keys[index][att] = {}; // 'keys', '0', 'function', 'operation'
                    }

                    if (funcAtt === "operation") {
                        formTemplate.keys[index][att][funcAtt] = value;
                    }

                    if (funcAtt === "params") {
                        if (!formTemplate.keys[index][att][funcAtt]) {
                            formTemplate.keys[index][att][funcAtt] = []; // 'keys', '0', 'function', 'params', '0'
                        }

                        formTemplate.keys[index][att][funcAtt][idFuncAtt] = value;
                    }
                }

            } else if (id.startsWith('typesResponsibilities.')) {
                const [type, index] = id.split('.'); // typesResponsibilities.0
                formTemplate[type][index] = value
            } else {
                if (id === "numberOfComplaints") {
                    formTemplate["typesResponsibilities"][0] = "Principal"
                }

                formTemplate[id] = value
            }

            return formTemplate;
        });
    };

    function setDataTo(data, content) {
        setTemplate((prevState) => ({
            ...prevState,
            contents: {
                ...prevState.contents,
                [data]: content
            }
        }));
    }

    function validateForm() {
        // Validar se o título está presente
        if (!template.title) {
            setErrorStatus('Por favor, forneça um título para o template.');
            return;
        }

        // Validar se há pelo menos um caminho e nenhum caminho vazio
        if (type === 'specific' && (!template.rout || template.rout.length === 0 || template.rout.some(path => !path.trim()))) {
            setErrorStatus('Por favor, adicione pelo menos um caminho válido.');
            return;
        }

        // Validar se há pelo menos uma chave do documento e nenhuma chave vazia
        if (
            template.keys &&
            template.keys.length > 0 &&
            template.keys.some(keys => !keys.id?.trim())
        ) {
            setErrorStatus('Por favor, preencha todas as chaves do documento.');
            return;
        }

        const contents = template.contents
        if (type === 'base' && (!contents.base)) {
            setErrorStatus('Por favor, adicione conteúdo em todos os editores');
            return;
        } else if (type === 'specific' && (!contents.fatos || !contents.fundamentos || !contents.pedidos)) {
            setErrorStatus('Por favor, adicione conteúdo em todos os editores');
            return;
        }

        if (type === 'base' && (!template.typeTermination)) {
            setErrorStatus('Por favor, preencha o tipo de recisão');
            return;
        }

        if (type === 'base' && (!template.numberOfComplaints)) {
            setErrorStatus('Por favor, informe o número de reclamadas');
            return;
        }

        if (type === 'base' && template.numberOfComplaints <= 0) {
            setErrorStatus('O número de reclamadas é inválido!');
            return;
        }

        if (type === 'base' && template.typesResponsibilities.filter(type => type === "Selecione").length > 0) {
            setErrorStatus('Por favor, preencha os tipos de responsabilidades para cada número de reclamadas.');
            return;
        }

        return true
    }

    const handleSaveTemplate = () => {
        if (validateForm()) {
            saveTemplate()
        }
    };

    const saveTemplate = async function () {
        try {
            addTemplate(template, type)
            setErrorStatus(null)
            closeDrawer();

        } catch (e) {
            setErrorStatus("Erro ao adicionar template:" + e)
        }
    }

    const handleDeleteTemplate = async () => {
        await removeTemplate(template.id, type)
        closeDrawer();
    };

    const handleAddRout = () => {
        setTemplate({
            ...template,
            rout: [...template.rout, '']
        });
    };

    const handleRemoveRout = (index) => {
        setTemplate((prevState) => {
            const updatedRout = [...prevState.rout];
            updatedRout.splice(index, 1);

            return {
                ...prevState,
                rout: updatedRout,
            };
        });
    };

    const handleAddKey = () => {
        setTemplate(prevState => {
            const newKey = { id: '', type: 'text' }
            const updatedKeyhandleAddKeys = [...prevState.keys, newKey]

            return {
                ...prevState,
                keys: updatedKeyhandleAddKeys,
            };
        });
    };

    const handleRemoveKey = (index) => {
        setTemplate((prevState) => {
            const updatedKeys = prevState.keys
            updatedKeys.splice(index, 1)

            return {
                ...prevState,
                keys: updatedKeys,
            };
        });
    };

    const autoGenerateKeys = () => {
        // Array para armazenar todas as chaves
        const allKeys = [];

        // Percorre cada objeto de dados em dataValue
        for (const dataObj of Object.values(template.contents)) {
            // Obtém as chaves do objeto de dados atual e adiciona ao array de todas as chaves
            const keys = extractKeys(dataObj);
            allKeys.push(...keys);
        }

        // Remove chaves duplicadas
        const uniqueKeys = [...new Set(allKeys)];

        // Mapeia cada chave para o formato de objeto desejado
        const keysArray = uniqueKeys.map((key, index) => ({
            id: key,
            type: 'text', // Se necessário, você pode ajustar o tipo conforme necessário
            function: { operation: '', params: [] }
        }));

        // Atualiza o estado com o novo array de chaves
        setTemplate(prevState => ({
            ...prevState,
            keys: keysArray
        }));
    }

    return (
        <div className='back-drawer-template'>
            <div className='drawer-template' onClick={(e) => e.stopPropagation()}>

                <form>
                    <h2>Edição</h2>

                    <MdDelete className='bt-template-delete' onClick={handleDeleteTemplate} />

                    <label htmlFor='title'>
                        <p>Titulo:</p>
                        <input
                            type='text'
                            id='title'
                            value={template?.title || ''}
                            onChange={handleInputChange}
                        />
                    </label>

                    {type === "base" && (
                        <div className='base-data'>
                            <div>
                                <p>Corpo:</p>
                                <MyEditor data={template.contents.base} onDataChange={(content) => { setDataTo("base", content) }} />
                            </div>

                            <label htmlFor='typeTermination'>
                                <p>Tipo de recisão:</p>
                                <select
                                    id='typeTermination'
                                    value={template?.typeTermination}
                                    onChange={handleInputChange}
                                >
                                    <option value=''>Selecione</option>
                                    <option value='Pedido de demissão'>Pedido de demissão</option>
                                    <option value='Demissão sem justa causa'>Demissão sem justa causa</option>
                                    <option value='Demissão por justa causa'>Demissão por justa causa</option>
                                </select>
                            </label>

                            <label htmlFor='numberOfComplaints'>
                                <p>Numero de reclamadas:</p>
                                <input
                                    type='number'
                                    id='numberOfComplaints'
                                    value={template?.numberOfComplaints || 0}
                                    onChange={handleInputChange}
                                />
                            </label>

                            {template.numberOfComplaints && (
                                <div>
                                    <p>Tipos de responsabilidades:</p>
                                    {Array.from({ length: template.numberOfComplaints }, (_, index) => (
                                        <label key={`tr-${index}`} htmlFor={`typesResponsibilities.${index}`}>
                                            <p>{`Reclamada ${index + 1}`}</p>
                                            <select
                                                id={`typesResponsibilities.${index}`}
                                                value={template.typesResponsibilities?.[index]}
                                                onChange={handleInputChange}
                                                disabled={index === 0}
                                            >
                                                {index === 0 && (<option value='Princiaal'>Principal</option>)}
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
                        <div className='base-specific'>
                            <div>
                                <p>Fatos:</p>
                                <MyEditor data={template.contents.fatos} onDataChange={(content) => { setDataTo("fatos", content) }} />
                            </div>


                            <div>
                                <p>Fundamentos:</p>
                                <MyEditor data={template.contents.fundamentos} onDataChange={(content) => { setDataTo("fundamentos", content) }} />
                            </div>

                            <div>
                                <p>Pedidos:</p>
                                <MyEditor data={template.contents.pedidos} onDataChange={(content) => { setDataTo("pedidos", content) }} />
                            </div>

                            <div>
                                <p>Caminho:</p>
                                {template.rout.map((rout, index) => (
                                    <label key={`rout-${index}`} htmlFor={`rout.${index}`} className='rout-item'>
                                        <input
                                            type='text'
                                            id={`rout.${index}`}
                                            value={rout || ""}
                                            onChange={handleInputChange}
                                        />
                                        <button className="bt-row" onClick={() => handleRemoveRout(index)}>-</button>
                                        {template.rout.length === index + 1 && (
                                            <button className="bt-row" onClick={handleAddRout}>+</button>
                                        )}
                                    </label>
                                ))}

                                {template.rout.length === 0 && (
                                    <button className="bt-add" onClick={handleAddRout}>Adicionar Caminho</button>
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <p>Chaves do Documento:</p>
                        {template.keys && template.keys.map((templateKey, index) => (
                            <div key={`key-${index}`} className='key-item'>
                                <div>
                                    <label htmlFor={`keys.${index}.id`} className='identifier'>
                                        <p>Identificador</p>
                                        <input
                                            type='text'
                                            id={`keys.${index}.id`}
                                            placeholder='Chave'
                                            value={templateKey?.id || ""}
                                            onChange={handleInputChange}
                                        />
                                    </label>

                                    <label htmlFor={`keys.${index}.type`} className='type'>
                                        <p>Tipo</p>
                                        <select
                                            id={`keys.${index}.type`}
                                            value={templateKey.type}
                                            onChange={handleInputChange}
                                        >
                                            <option value='text'>Texto</option>
                                            {type === 'base' && (<option value='fatos'>Fatos</option>)}
                                            {type === 'base' && (<option value='fundamentos'>Fundamentos</option>)}
                                            {type === 'base' && (<option value='pedidos'>Pedidos</option>)}
                                            <option value='monetary'>Monetário</option>
                                            <option value='date'>Data</option>
                                            <option value='number'>Numero</option>
                                            <option value='function'>Função</option>
                                        </select>
                                    </label>

                                    {templateKey.type === "function" && (
                                        <label htmlFor={`keys.${index}.function.operation`} className='operation'>
                                            <p>Operação</p>
                                            <select
                                                id={`keys.${index}.function.operation`}
                                                value={templateKey.function?.type}
                                                onChange={handleInputChange}
                                            >
                                                <option key={''} value={null}>Selecione</option>
                                                {Object.entries(functions).map(([operation, { name }]) => (
                                                    <option key={operation} value={operation}>{name}</option>
                                                ))}
                                            </select>
                                        </label>
                                    )}

                                    {templateKey.type !== "function" && (
                                        <div className='bts-row'>
                                            <button className="bt-row" onClick={() => handleRemoveKey(index)}>-</button>
                                            {template.keys.length === index + 1 && (
                                                <button className="bt-row" onClick={handleAddKey}>+</button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {templateKey.type === "function" && (
                                    <div>
                                        {templateKey.function?.operation && functions[templateKey.function.operation]?.params.map((param, paramIndex) => (
                                            <label key={`param-${paramIndex}`} htmlFor={`keys.${index}.function.params.${paramIndex}`} className='param'>
                                                <p>{param.name}</p>
                                                <input
                                                    type='text'
                                                    id={`keys.${index}.function.params.${paramIndex}`}
                                                    placeholder={param.name}
                                                    value={templateKey.function?.params?.[paramIndex] || ""}
                                                    onChange={handleInputChange}
                                                />
                                            </label>
                                        ))}

                                        <div className='bts-row'>
                                            <button className="bt-row" onClick={() => handleRemoveKey(index)}>-</button>
                                            {template.keys.length === index + 1 && (
                                                <button className="bt-row" onClick={handleAddKey}>+</button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {(!template.keys || template.keys.length === 0) && (
                            <button className="bt-add" onClick={handleAddKey}>Adicionar Chaves</button>
                        )}
                        <button type="button" className="bt-add bt-auto-generate" onClick={autoGenerateKeys}>Auto generate</button>
                    </div>
                </form>

                <div className='template-bts-act'>
                    <button className="bt-cancelar" onClick={closeDrawer}>Cancelar</button>
                    <button className="bt-aplicar" onClick={handleSaveTemplate}>Aplicar</button>
                </div>

                <div>
                    {errorStatus && <p>{errorStatus}</p>}
                </div>
            </div>
        </div>
    )
}