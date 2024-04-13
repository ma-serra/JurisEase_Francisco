import './Template.css';
import React, { useEffect, useState } from 'react';

import Header from '../../components/Header/Header';
import CardTemplate from '../../components/Cards/CardTemplate/CardTemplate';
import MyEditor from '../../components/MyEditor/MyEditor';
import Search from '../../components/Search/Search';

import { getUser } from '../../utils/data_base/firebase/dao/userDAO';
import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication';
import { getTemplates, addTemplate, removeTemplate } from '../../utils/data_base/firebase/dao/templateDAO';
import { MdLibraryAdd, MdDelete } from 'react-icons/md';
import { removeObjetosVazios, extractKeys, normalizeText } from '../../utils/tools/tools'
import { useNavigate } from 'react-router-dom';

function Template() {
    const [datasEditors, setDatasEditors] = useState({
        dataBase: "",
        dataFatos: "",
        dataFundamentos: "",
        dataPedidos: ""
    });

    function setDataTo(data, content) {
        setDatasEditors(prevState => ({
            ...prevState,
            [data]: content
        }));
    }

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
        keys: [],
        contents: {},
        typeTermination: "",
        numberOfComplaints: "",
        typesResponsibilities: []
    });

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

    function logBase() {
        console.log(templatesBase)
    }

    function logEspecific() {
        console.log(templatesEspecific)
    }

    const handleInputChange = (event) => {
        const { id, value } = event.target;

        setEditedTemplate(prevState => {
            const formTemplate = { ...prevState };

            if (id.startsWith('rout.')) {
                const [, index] = id.split('.'); // rout.0
                formTemplate.rout[index] = value

            } else if (id.startsWith('keys.')) {
                const [, index, type] = id.split('.'); // keys.0.name
                formTemplate.keys[index][type] = value

            } else if (id.startsWith('typesResponsibilities.')) {
                const [, index] = id.split('.'); // typesResponsibilities.0
                formTemplate.typesResponsibilities[index] = value
            } else {
                formTemplate[id] = value
            }

            return formTemplate;
        });
    };

    function handleAddTemplateClick (type) {
        setDrawerOpen(true)
        setDrawerType(type)

        setEditedTemplate({
            title: "",
            rout: [],
            keys: [],
            contents: {},
            typeTermination: "",
            numberOfComplaints: "",
            typesResponsibilities: []
        });
        setDatasEditors({})
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
            contents: data.contents || {},
            typeTermination: data.typeTermination || "",
            numberOfComplaints: data.numberOfComplaints || "",
            typesResponsibilities: data.typesResponsibilities || []
        }));

        // Definir os dados de acordo com o tipo de gaveta
        setDatasEditors((prevState) => {
            if (drawerType === "base") {
                return {
                    dataBase: data.contents.base || "",
                    dataFatos: "",
                    dataFundamentos: "",
                    dataPedidos: "",
                };
            } else if (drawerType === "specific") {
                return {
                    dataBase: "",
                    dataFatos: data.contents.fatos || "",
                    dataFundamentos: data.contents.fundamentos || "",
                    dataPedidos: data.contents.pedidos || "",
                };
            }

            // Retornar o estado anterior se o tipo de gaveta não for reconhecido
            return prevState;
        });
    };


    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditedTemplate({
            title: "",
            rout: [],
            keys: {},
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
        if (!editedTemplate.rout || editedTemplate.rout.length === 0 || editedTemplate.rout.some(path => !path.trim())) {
            setErrorStatus('Por favor, adicione pelo menos um caminho válido.');
            return;
        }

        // Validar se há pelo menos uma chave do documento e nenhuma chave vazia
        if (
            editedTemplate.keys &&
            editedTemplate.keys.length > 0 &&
            editedTemplate.keys.some(keys => !keys.name.trim())
        ) {
            setErrorStatus('Por favor, preencha todas as chaves do documento.');
            return;
        }

        if (drawerType === 'base' && (!datasEditors.dataBase)) {
            setErrorStatus('Por favor, adicione conteúdo em todos os editores');
            return;
        } else if (drawerType === 'specific' && (!datasEditors.dataFatos || !datasEditors.dataFundamentos || !datasEditors.dataPedidos)) {
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

        if (drawerType === 'base' && editedTemplate.typesResponsibilities.filter(type => type === "Selecione").length > 0) {
            setErrorStatus('Por favor, preencha os tipos de responsabilidades para cada número de reclamadas.');
            return;
        }

        editedTemplate.contents = datasEditors
        salvarTemplate()
    };

    const salvarTemplate = async function () {
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
        if(drawerType === "base" && templatesBase.length === 1) {
            setTemplatesBase([])
        }else 
        if(drawerType === "specific" && templatesEspecific.length === 1) {
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
                keys: prevState.keys || [],
            };
        });
    };

    const handleAddKey = () => {
        try {
            setEditedTemplate(prevState => {
                const updatedKeyhandleAddKeys = prevState.keys
                    ? [...prevState.keys, { name: '', type: 'texto' }]
                    : [{ name: '', type: 'texto' }];

                return {
                    ...prevState,
                    keys: updatedKeyhandleAddKeys,
                    rout: prevState.rout || [],
                };
            });
        } catch (e) {
            //ignored
        }
    };

    const handleRemoveKey = (index) => {
        try {
            setEditedTemplate((prevState) => {
                const updatedKeys = prevState.keys ? [...prevState.keys] : [];

                updatedKeys.splice(index, 1);

                return {
                    ...prevState,
                    keys: updatedKeys,
                };
            });
        } catch (e) {
            console.log(e.message)
        }

    };

    const autoGenerateKeys = () => {
        // Array para armazenar todas as chaves
        const allKeys = [];

        // Percorre cada objeto de dados em dataValue
        for (const dataObj of Object.values(datasEditors)) {
            // Obtém as chaves do objeto de dados atual e adiciona ao array de todas as chaves
            const keys = extractKeys(dataObj);
            allKeys.push(...keys);
        }

        // Remove chaves duplicadas
        const uniqueKeys = [...new Set(allKeys)];

        // Mapeia cada chave para o formato de objeto desejado
        const keysArray = uniqueKeys.map((key, index) => ({
            name: key,
            type: 'texto' // Se necessário, você pode ajustar o tipo conforme necessário
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

                    <div className='grd-templates'>
                        {filtredTemplatesBase === null ? (
                            templatesBase && templatesBase.length > 0 ? (
                                templatesBase.map((template, index) => (
                                    <CardTemplate key={index} card={template} onClick={() => handleCardClick(template, "base")} />
                                ))
                            ) : (
                                <p>Nenhum template encontrado!</p>
                            )
                        ) : (
                            filtredTemplatesBase.length > 0 ? (
                                filtredTemplatesBase.map((template, index) => (
                                    <CardTemplate key={index} card={template} onClick={() => handleCardClick(template, "base")} />
                                ))
                            ) : (
                                <p>Nenhum template encontrado!</p>
                            )
                        )}
                    </div>

                    <div className='title-specific'>
                        <h1>Específicos</h1>
                        <MdLibraryAdd className='bt-add-template' onClick={() => (handleAddTemplateClick("specific"))} />
                    </div>

                    <div className='grd-templates'>
                        {filtredTemplatesEspecific === null ? (
                            templatesEspecific && templatesEspecific.length > 0 ? (
                                templatesEspecific.map((template, index) => (
                                    <CardTemplate key={index} card={template} onClick={() => handleCardClick(template, "specific")} />
                                ))
                            ) : (
                                <p>Nenhum template encontrado!</p>
                            )
                        ) : (
                            filtredTemplatesEspecific.length > 0 ? (
                                filtredTemplatesEspecific.map((template, index) => (
                                    <CardTemplate key={index} card={template} onClick={() => handleCardClick(template, "specific")} />
                                ))
                            ) : (
                                <p>Nenhum template encontrado!</p>
                            )
                        )}
                    </div>

                </div>

                <button onClick={logBase}>Log Base</button>
                <button onClick={logEspecific}>Log Específicos</button>
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
                                            <MyEditor data={datasEditors.dataBase} onDataChange={(content) => { setDataTo("dataBase", content) }} />
                                        </div>

                                        <label htmlFor='typeTermination'>
                                            <p>Tipo de recisão:</p>
                                            <select
                                                id='typeTermination'
                                                value={editedTemplate?.typeTermination || ''}
                                                onChange={handleInputChange}
                                            >
                                                <option value={null}>Selecione</option>
                                                <option value='Pedido de demissão'>Pedido de demissão</option>
                                                <option value='Demissão sem justa causa'>Demissão sem justa causa</option>
                                                <option value='Demissão por justa causa'>Demissão por justa causa</option>
                                            </select>
                                        </label>

                                        <label htmlFor='numberOfComplaints'>
                                            <p>Numero de reclamadas:</p>
                                            <input
                                                type='text'
                                                id='numberOfComplaints'
                                                value={editedTemplate?.numberOfComplaints || ''}
                                                onChange={handleInputChange}
                                            />
                                        </label>

                                        {editedTemplate.numberOfComplaints && (
                                            <label>
                                                <p>Tipos de responsabilidades:</p>
                                                {Array.from({ length: editedTemplate.numberOfComplaints }, (_, index) => (
                                                    <label key={index} htmlFor={`typesResponsibilities.${index}`}>
                                                        <p>{index}</p>
                                                        <select
                                                            id={`typesResponsibilities.${index}`}
                                                            value={editedTemplate.typesResponsibilities?.[index]}
                                                            onChange={handleInputChange}
                                                        >
                                                            <option value={null}>Selecione</option>
                                                            <option value='main'>Principal</option>
                                                            <option value='solidarity'>Solidária</option>
                                                            <option value='subsidiary'>Subsidiária</option>
                                                        </select>
                                                    </label>
                                                ))}
                                            </label>
                                        )}

                                    </div>
                                )}

                                {drawerType === "specific" && (
                                    <div className='base-specific'>
                                        <div>
                                            <p>Fatos:</p>
                                            <MyEditor data={datasEditors.dataFatos} onDataChange={(content) => { setDataTo("dataFatos", content) }} />
                                        </div>


                                        <div>
                                            <p>Fundamentos:</p>
                                            <MyEditor data={datasEditors.dataFundamentos} onDataChange={(content) => { setDataTo("dataFundamentos", content) }} />
                                        </div>

                                        <div>
                                            <p>Pedidos:</p>
                                            <MyEditor data={datasEditors.pedidos} onDataChange={(content) => { setDataTo("dataPedidos", content) }} />
                                        </div>

                                    </div>
                                )}

                                <label>
                                    <p>Caminho:</p>
                                    {editedTemplate.rout.map((rout, index) => (
                                        <label htmlFor={`rout.${index}`} key={index}>
                                            <input
                                                type='text'
                                                id={`rout.${index}`}
                                                value={rout}
                                                onChange={handleInputChange}
                                            />
                                            {editedTemplate.rout.length === index + 1 && (
                                                <button className="bt-rout" onClick={handleAddRout}>+</button>
                                            )}
                                            {editedTemplate.rout.length === index + 1 && (
                                                <button className="bt-rout" onClick={() => handleRemoveRout(index)}>-</button>
                                            )}
                                        </label>
                                    ))}
                                    {editedTemplate.rout.length === 0 && (
                                        <button className="bt-addvar" onClick={handleAddRout}>Adicionar Caminho</button>
                                    )}
                                </label>

                                <label>
                                    <p>Chaves do Documento:</p>
                                    {editedTemplate.keys && editedTemplate.keys.map((key, index) => (
                                        <label key={index}>
                                            <label htmlFor={`keys.${index}.name`}>
                                                <input
                                                    type='text'
                                                    id={`keys.${index}.name`}
                                                    placeholder='Chave'
                                                    value={key.name}
                                                    onChange={handleInputChange}
                                                />
                                            </label>

                                            <label htmlFor={`keys.${index}.name`}>
                                                <select
                                                    id={`keys.${index}.type`}
                                                    value={key.type}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value='text'>Texto</option>
                                                    <option value='monetary'>Monetário</option>
                                                    <option value='date'>Data</option>
                                                    <option value='integer'>Inteiro</option>
                                                    <option value='function'>Função</option>
                                                </select>
                                            </label>

                                            {editedTemplate.keys.length === index + 1 && (
                                                <button className="bt-rout" onClick={handleAddKey}>+</button>
                                            )}
                                            {editedTemplate.keys.length === index + 1 && (
                                                <button className="bt-rout" onClick={() => handleRemoveKey(index)}>-</button>
                                            )}
                                        </label>
                                    ))}

                                    {(!editedTemplate.keys || editedTemplate.keys.length === 0) && (
                                        <button className="bt-addvar" onClick={handleAddKey}>Adicionar Chave do Documento</button>
                                    )}
                                    <button type="button" className="bt-auto-generate" onClick={autoGenerateKeys}>Auto generate</button>
                                </label>
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