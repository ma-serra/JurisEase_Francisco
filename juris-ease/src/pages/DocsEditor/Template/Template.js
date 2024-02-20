import './Template.css';
import React, { useEffect, useState } from 'react';

import Header from '../../../components/Header/Header';
import CardTemplate from './CardTemplate/CardTemplate';
import { getUser } from '../../../utils/data_base/firebase/dao/userDAO';
import { isUserAuthenticated } from '../../../utils/data_base/firebase/authentication';
import { getTemplates, addTemplate, removeTemplate } from '../../../utils/data_base/firebase/dao/templateDAO';
import { MdLibraryAdd, MdDelete } from 'react-icons/md';
import { removeObjetosVazios, extractKeys } from '../../../utils/tools/tools'
import MyEditor from '../../../components/MyEditor/MyEditor';

function Template() {
    const [dataValue, setDataValue] = useState("<p>Seu texto aqui</p>");

    const [errorStatus, setErrorStatus] = useState(null);

    // User
    const [user, setUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [editedTemplate, setEditedTemplate] = useState({
        title: '',
        content: '',
        rout: [],
        keys: []
    });

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

        const fetchTemplatesAndListen = () => {
            getTemplates((templatesData) => {
                const templates = removeObjetosVazios(templatesData)
                setTemplates(templates);
                console.log("Templates:", templates)
            });
        };

        fetchTemplatesAndListen();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('rout.')) {
            const routProperty = name.split('.')[1];
            const updatedRout = [...editedTemplate.rout];
            updatedRout[parseInt(routProperty, 10)] = value;

            setEditedTemplate({
                ...editedTemplate,
                rout: updatedRout
            });

        } else if (name.startsWith('keys.')) {
            const keyParts = name.split('.');
            const keyIndex = parseInt(keyParts[1], 10);
            const keyProperty = keyParts[2];

            setEditedTemplate((prevState) => {
                const updatedKeyhandleAddKeys = prevState.keys
                    ? [...prevState.keys]
                    : [];

                if (updatedKeyhandleAddKeys[keyIndex]) {
                    updatedKeyhandleAddKeys[keyIndex] = {
                        ...updatedKeyhandleAddKeys[keyIndex],
                        [keyProperty]: value
                    };
                }

                return {
                    ...prevState,
                    keys: updatedKeyhandleAddKeys,
                };
            });
        } else {
            // Atualização do campo de título
            setEditedTemplate((prevState) => ({
                ...prevState,
                title: value
            }));
        }
    };


    const handleAddTemplateClick = () => {
        setDrawerOpen(true);
        setEditedTemplate({
            title: '',
            content: '',
            rout: [],
            keys: []
        });
    };

    const handleCardClick = (data) => {
        setDrawerOpen(true);

        setEditedTemplate((prevState) => ({
            ...prevState,
            id: data.id || null,
            title: data.title || '',
            content: data.content || '',
            rout: data.rout || [],
            keys: data.keys || [],
        }));

        setDataValue(data.content)

        console.log("handleCardClick:", editedTemplate)
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditedTemplate({
            title: '',
            content: '',
            rout: [],
            keys: []
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

        if (dataValue.length === 0) {
            setErrorStatus('Por favor, preencha o documento.');
            return;
        }

        editedTemplate.content = dataValue;

        salvarTemplate()
    };

    const salvarTemplate = async function () {
        try {
            addTemplate(editedTemplate)
            setErrorStatus(null)
            closeDrawer();

        } catch (e) {
            setErrorStatus("Erro ao adicionar template:" + e)
        }
    }

    const handleDeleteTemplate = async () => {
        // Handle logic for saving the edited template
        console.log("handleDeleteTemplate:", editedTemplate)
        await removeTemplate(editedTemplate.id)
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
                console.log(prevState)
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
        const keys = extractKeys(dataValue);
        console.log(keys)

        // Mapeia cada chave para o formato de objeto desejado
        const keysArray = keys.map((key, index) => ({
            name: key,
            type: 'texto' // Se necessário, você pode ajustar o tipo conforme necessário
        }));

        // Atualiza o estado com o novo array de chaves
        setEditedTemplate({
            ...editedTemplate,
            keys: keysArray
        });
    }

    return (
        <div className={`Template`}>
            <Header user={user} />

            <div className='title'>
                <h1>Templates</h1>
                <MdLibraryAdd className='bt-add-template' onClick={handleAddTemplateClick} />
            </div>

            <div className='grd_templates'>
                {templates.map((template, index) => (
                    <CardTemplate key={index} data={template} onClick={() => handleCardClick(template)} />
                ))}
            </div>

            {drawerOpen && (
                <div className='back_drawer_template' onClick={closeDrawer}>
                    <div className='drawer_template' onClick={(e) => e.stopPropagation()}>
                        <h2>Edit Template</h2>
                        <MdDelete className='bt-template-delete' onClick={handleDeleteTemplate} />

                        <form>
                            <div>
                                <label>
                                    Titulo:
                                    <input
                                        type='text'
                                        id='title'
                                        value={editedTemplate?.title || ''}
                                        onChange={handleInputChange}
                                    />
                                </label>
                            </div>
                            <div>
                                <MyEditor data={dataValue} onDataChange={setDataValue} />
                            </div>
                            <div>
                                <label>Caminho:</label>
                                {editedTemplate.rout.map((rout, index) => (
                                    <div className='rout-item' key={index}>
                                        <input
                                            type='text'
                                            name={`rout.${index}`}
                                            value={rout}
                                            onChange={handleInputChange}
                                        />
                                        {editedTemplate.rout.length === index + 1 && (
                                            <button className="bt-rout" onClick={handleAddRout}>+</button>
                                        )}
                                        {editedTemplate.rout.length === index + 1 && (
                                            <button className="bt-rout" onClick={() => handleRemoveRout(index)}>-</button>
                                        )}
                                    </div>
                                ))}
                                {editedTemplate.rout.length === 0 && (
                                    <button className="bt-addvar" onClick={handleAddRout}>Adicionar Caminho</button>
                                )}
                            </div>
                            <div>
                                <label>Chaves do Documento:</label>
                                {editedTemplate.keys && editedTemplate.keys.map((key, index) => (
                                    <div className='doc-key-item' key={index}>
                                        <input
                                            type='text'
                                            name={`keys.${index}.name`}
                                            placeholder='Chave'
                                            value={key.name}
                                            onChange={handleInputChange}
                                        />
                                        <select
                                            name={`keys.${index}.type`}
                                            value={key.type}
                                            onChange={handleInputChange}
                                        >
                                            <option value='texto'>Texto</option>
                                            <option value='monetário'>Monetário</option>
                                            <option value='data'>Data</option>
                                            <option value='inteiro'>Inteiro</option>
                                            {/* Adicione outros tipos conforme necessário */}
                                        </select>
                                        {editedTemplate.keys.length === index + 1 && (
                                            <button className="bt-rout" onClick={handleAddKey}>+</button>
                                        )}
                                        {editedTemplate.keys.length === index + 1 && (
                                            <button className="bt-rout" onClick={() => handleRemoveKey(index)}>-</button>
                                        )}
                                    </div>
                                ))}
                                {(!editedTemplate.keys || editedTemplate.keys.length === 0) && (
                                    <button className="bt-addvar" onClick={handleAddKey}>Adicionar Chave do Documento</button>
                                )}
                                <button type="button" className="bt-auto-generate" onClick={autoGenerateKeys}>Auto generate</button>
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
    );
}

export default Template;