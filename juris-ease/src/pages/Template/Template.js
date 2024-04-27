import './Template.css';
import React, { useEffect, useState } from 'react';

import Header from '../../components/Header/Header';
import MyEditor from '../../components/MyEditor/MyEditor';
import Search from '../../components/Search/Search';

import { getUser } from '../../utils/data_base/firebase/dao/userDAO';
import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication';
import { getTemplates, addTemplate, removeTemplate } from '../../utils/data_base/firebase/dao/templateDAO';
import { MdLibraryAdd, MdDelete } from 'react-icons/md';
import { extractKeys, normalizeText } from '../../utils/tools/tools'
import { useNavigate } from 'react-router-dom';
import { functions } from '../../utils/tools/functions';

function Template() {
    const [search, setSearch] = useState('');
    const [filtredTemplatesBase, setFiltredTemplatesBase] = useState(null)
    const [filtredTemplatesEspecific, setFiltredTemplatesEspecific] = useState(null)
    const [errorStatus, setErrorStatus] = useState(null);

    const [user, setUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState("");
    const [templatesBase, setTemplatesBase] = useState([]);
    const [templatesEspecific, setTemplatesEspecific] = useState([]);
    const [editedTemplate, setEditedTemplate] = useState({
        title: "",
        rout: [],
        keys: [{ id: '', type: '', function: { operation: '', params: [] } }],
        contents: {
            base: "",
            fatos: "",
            fundamentos: "",
            pedidos: ""
        },
        typeTermination: "",
        numberOfComplaints: "",
        typesResponsibilities: []
    });

    function setDataTo(data, content) {
        setEditedTemplate((prevState) => ({
            ...prevState,
            contents: {
                ...prevState.contents,
                [data]: content
            }
        }));
    }

    const filterCards = (filterText) => {
        if (!filterText) {
            return null
        }

        const searchText = normalizeText(filterText)

        let filtered = templatesBase.filter(card => {
            const content = normalizeText(card.content)
            const title = normalizeText(card.title)
            const rout = normalizeText(card.rout)

            return title.includes(searchText) || content.includes(searchText) || rout.includes(searchText);
        });

        setFiltredTemplatesBase(filtered);

        filtered = templatesEspecific.filter(card => {
            const content = normalizeText(card.content)
            const title = normalizeText(card.title)
            const rout = normalizeText(card.rout)

            return title.includes(searchText) || content.includes(searchText) || rout.includes(searchText);
        });

        setFiltredTemplatesEspecific(filtered);
    };

    useEffect(() => {
        filterCards(search.trim());
    }, [search]);

    useEffect(() => {
        async function fetchUser() {
            try {
                const isAuthenticated = isUserAuthenticated();

                if (isAuthenticated) {
                    const userData = await getUser(isAuthenticated);
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchTemplatesAndListen = (type, setTemplatesType) => {
            getTemplates((templatesData) => {
                console.log("fetchTemplatesAndListen:", templatesData)
                setTemplatesType(templatesData || []);
            }, type);
        };

        fetchTemplatesAndListen("base", setTemplatesBase);
        fetchTemplatesAndListen("specific", setTemplatesEspecific);
    }, [])

    const handleInputChange = (event) => {
        const { id, value } = event.target;

        setEditedTemplate(prevState => {
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

    function handleAddTemplateClick(type) {
        setDrawerOpen(true)
        setDrawerType(type)

        setEditedTemplate({
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
        });
    };

    const handleCardClick = (data, type) => {
        setDrawerOpen(true)
        setDrawerType(type)

        setEditedTemplate((prevState) => ({
            ...prevState,
            id: data.id || null,
            title: data.title || "",
            rout: data.rout || [],
            keys: data.keys || [],
            contents: {
                base: data.contents.base || "",
                fatos: data.contents.fatos || "",
                fundamentos: data.contents.fundamentos || "",
                pedidos: data.contents.pedidos || "",
            },
            typeTermination: data.typeTermination || "",
            numberOfComplaints: data.numberOfComplaints || "",
            typesResponsibilities: data.typesResponsibilities || []
        }));
    };


    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditedTemplate({
            title: "",
            rout: [],
            keys: [{ id: '', type: '', function: { operation: '', params: [] } }],
            contents: {},
            typeTermination: "",
            numberOfComplaints: "",
            typesResponsibilities: []
        });
    };

    const handleSaveTemplate = () => {
        // Validar se o título está presente
        if (!editedTemplate.title) {
            setErrorStatus('Por favor, forneça um título para o template.');
            return;
        }

        // Validar se há pelo menos um caminho e nenhum caminho vazio
        if (drawerType === 'specific' && (!editedTemplate.rout || editedTemplate.rout.length === 0 || editedTemplate.rout.some(path => !path.trim()))) {
            setErrorStatus('Por favor, adicione pelo menos um caminho válido.');
            return;
        }

        // Validar se há pelo menos uma chave do documento e nenhuma chave vazia
        if (
            editedTemplate.keys &&
            editedTemplate.keys.length > 0 &&
            editedTemplate.keys.some(keys => !keys.id?.trim())
        ) {
            setErrorStatus('Por favor, preencha todas as chaves do documento.');
            return;
        }

        const contents = editedTemplate.contents
        if (drawerType === 'base' && (!contents.base)) {
            setErrorStatus('Por favor, adicione conteúdo em todos os editores');
            return;
        } else if (drawerType === 'specific' && (!contents.fatos || !contents.fundamentos || !contents.pedidos)) {
            setErrorStatus('Por favor, adicione conteúdo em todos os editores');
            return;
        }

        if (drawerType === 'base' && (!editedTemplate.typeTermination)) {
            setErrorStatus('Por favor, preencha o tipo de recisão');
            return;
        }

        if (drawerType === 'base' && (!editedTemplate.numberOfComplaints)) {
            setErrorStatus('Por favor, informe o número de reclamadas');
            return;
        }

        if (drawerType === 'base' && editedTemplate.numberOfComplaints <= 0) {
            setErrorStatus('O número de reclamadas é inválido!');
            return;
        }

        if (drawerType === 'base' && editedTemplate.typesResponsibilities.filter(type => type === "Selecione").length > 0) {
            setErrorStatus('Por favor, preencha os tipos de responsabilidades para cada número de reclamadas.');
            return;
        }

        saveTemplate()
    };

    const saveTemplate = async function () {
        try {
            addTemplate(editedTemplate, drawerType)
            setErrorStatus(null)
            closeDrawer();

        } catch (e) {
            setErrorStatus("Erro ao adicionar template:" + e)
        }
    }

    const handleDeleteTemplate = async () => {
        await removeTemplate(editedTemplate.id, drawerType)
        if (drawerType === "base" && templatesBase.length === 1) {
            setTemplatesBase([])
        } else
            if (drawerType === "specific" && templatesEspecific.length === 1) {
                setTemplatesEspecific([])
            }
        closeDrawer();
    };

    const handleAddRout = () => {
        setEditedTemplate({
            ...editedTemplate,
            rout: [...editedTemplate.rout, '']
        });
    };

    const handleRemoveRout = (index) => {
        setEditedTemplate((prevState) => {
            const updatedRout = [...prevState.rout];
            updatedRout.splice(index, 1);

            return {
                ...prevState,
                rout: updatedRout,
            };
        });
    };

    const handleAddKey = () => {
        try {
            setEditedTemplate(prevState => {
                const newKey = { id: '', type: 'text', function: { operation: '', params: [] } }
                const updatedKeyhandleAddKeys = prevState.keys
                    ? [...prevState.keys, newKey]
                    : [newKey];

                return {
                    ...prevState,
                    keys: updatedKeyhandleAddKeys,
                };
            });
        } catch (e) {
            console.error("Erro ao adicionar chaves:", e.message)
        }
    };

    const handleRemoveKey = (index) => {
        try {
            setEditedTemplate((prevState) => {
                const updatedKeys = prevState.keys ? [...prevState.keys] : [{ id: '', type: '', function: { operation: '', params: [] } }]

                updatedKeys.splice(index, 1);

                return {
                    ...prevState,
                    keys: updatedKeys,
                };
            });
        } catch (e) {
            console.error("Erro ao remover chave:", e.message)
        }

    };

    const autoGenerateKeys = () => {
        // Array para armazenar todas as chaves
        const allKeys = [];

        // Percorre cada objeto de dados em dataValue
        for (const dataObj of Object.values(editedTemplate.contents)) {
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
        setEditedTemplate(prevState => ({
            ...prevState,
            keys: keysArray
        }));
    }

    const navigate = useNavigate();
    const navigateTo = (link) => {
        navigate(`/${link}`);
    };

    const breakAcess = () => {
        while (!user) {
            setTimeout(500)
        }

        if (!user.permissions.templates) {
            alert('Usuario não tem permissão de acesso a essa página!')
            navigateTo('')
        }
    }

    return (
        <div className={`Template`}>
            <Header user={user} />

            {user && (
                breakAcess()
            )}

            <div className='content'>

                <div className='content-templates'>
                    <div className='title'>
                        <h1>Templates</h1>
                    </div>

                    <div className='search-templates'>
                        <Search setSearch={setSearch} />
                    </div>

                    <div className='title-base'>
                        <h1>Base</h1>
                        <MdLibraryAdd className='bt-add-template' onClick={() => (handleAddTemplateClick("base"))} />
                    </div>

                    <div className='div-scroll'>
                        <div className='grd-templates'>
                            {filtredTemplatesBase === null ? (
                                templatesBase && templatesBase.length > 0 ? (
                                    templatesBase.map((template, index) => (
                                        <div key={index} className={`card`} onClick={() => handleCardClick(template, "base")}>
                                            <h1>{template.title}</h1>
                                            <p>{template.rout}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>Nenhum template encontrado!</p>
                                )
                            ) : (
                                filtredTemplatesBase.length > 0 ? (
                                    filtredTemplatesBase.map((template, index) => (
                                        <div key={index} className={`card`} onClick={() => handleCardClick(template, "base")}>
                                            <h1>{template.title}</h1>
                                            <p>{template.rout}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>Nenhum template encontrado!</p>
                                )
                            )}
                        </div>
                    </div>


                    <div className='title-specific'>
                        <h1>Específicos</h1>
                        <MdLibraryAdd className='bt-add-template' onClick={() => (handleAddTemplateClick("specific"))} />
                    </div>

                    <div className='div-scroll'>
                        <div className='grd-templates'>
                            {filtredTemplatesEspecific === null ? (
                                templatesEspecific && templatesEspecific.length > 0 ? (
                                    templatesEspecific.map((template, index) => (
                                        <div key={index} className={`card`} onClick={() => handleCardClick(template, "specific")}>
                                            <h1>{template.title}</h1>
                                            <p>{template.rout}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>Nenhum template encontrado!</p>
                                )
                            ) : (
                                filtredTemplatesEspecific.length > 0 ? (
                                    filtredTemplatesEspecific.map((template, index) => (
                                        <div key={index} className={`card`} onClick={() => handleCardClick(template, "specific")}>
                                            <h1>{template.title}</h1>
                                            <p>{template.rout}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>Nenhum template encontrado!</p>
                                )
                            )}
                        </div>
                    </div>

                </div>

                {drawerOpen && (
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
                                        value={editedTemplate?.title || ''}
                                        onChange={handleInputChange}
                                    />
                                </label>

                                {drawerType === "base" && (
                                    <div className='base-data'>
                                        <div>
                                            <p>Corpo:</p>
                                            <MyEditor data={editedTemplate.contents.base} onDataChange={(content) => { setDataTo("base", content) }} />
                                        </div>

                                        <label htmlFor='typeTermination'>
                                            <p>Tipo de recisão:</p>
                                            <select
                                                id='typeTermination'
                                                value={editedTemplate?.typeTermination}
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
                                                value={editedTemplate?.numberOfComplaints || 0}
                                                onChange={handleInputChange}
                                            />
                                        </label>

                                        {editedTemplate.numberOfComplaints && (
                                            <div>
                                                <p>Tipos de responsabilidades:</p>
                                                {Array.from({ length: editedTemplate.numberOfComplaints }, (_, index) => (
                                                    <label key={`tr-${index}`} htmlFor={`typesResponsibilities.${index}`}>
                                                        <p>{`Reclamada ${index + 1}`}</p>
                                                        <select
                                                            id={`typesResponsibilities.${index}`}
                                                            value={editedTemplate.typesResponsibilities?.[index]}
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

                                {drawerType === "specific" && (
                                    <div className='base-specific'>
                                        <div>
                                            <p>Fatos:</p>
                                            <MyEditor data={editedTemplate.contents.fatos} onDataChange={(content) => { setDataTo("fatos", content) }} />
                                        </div>


                                        <div>
                                            <p>Fundamentos:</p>
                                            <MyEditor data={editedTemplate.contents.fundamentos} onDataChange={(content) => { setDataTo("fundamentos", content) }} />
                                        </div>

                                        <div>
                                            <p>Pedidos:</p>
                                            <MyEditor data={editedTemplate.contents.pedidos} onDataChange={(content) => { setDataTo("pedidos", content) }} />
                                        </div>

                                        <div>
                                            <p>Caminho:</p>
                                            {editedTemplate.rout.map((rout, index) => (
                                                <label key={`rout-${index}`} htmlFor={`rout.${index}`} className='rout-item'>
                                                    <input
                                                        type='text'
                                                        id={`rout.${index}`}
                                                        value={rout || ""}
                                                        onChange={handleInputChange}
                                                    />
                                                    <button className="bt-row" onClick={() => handleRemoveRout(index)}>-</button>
                                                    {editedTemplate.rout.length === index + 1 && (
                                                        <button className="bt-row" onClick={handleAddRout}>+</button>
                                                    )}
                                                </label>
                                            ))}

                                            {editedTemplate.rout.length === 0 && (
                                                <button className="bt-add" onClick={handleAddRout}>Adicionar Caminho</button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p>Chaves do Documento:</p>
                                    {editedTemplate.keys && editedTemplate.keys.map((templateKey, index) => (
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
                                                        {drawerType === 'base' && (<option value='fatos'>Fatos</option>)}
                                                        {drawerType === 'base' && (<option value='fundamentos'>Fundamentos</option>)}
                                                        {drawerType === 'base' && (<option value='pedidos'>Pedidos</option>)}
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
                                                        {editedTemplate.keys.length === index + 1 && (
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
                                                        {editedTemplate.keys.length === index + 1 && (
                                                            <button className="bt-row" onClick={handleAddKey}>+</button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {(!editedTemplate.keys || editedTemplate.keys.length === 0) && (
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
                )}
            </div>

        </div>
    );
}

export default Template;