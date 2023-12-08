import './Template.css';
import React, { useCallback, useEffect, useState } from 'react';

import Header from '../../../components/Header/Header';
import CardTemplate from './CardTemplate/CardTemplate';
import { getUser } from '../../../utils/data_base/firebase/dao/userDAO';
import { isUserAuthenticated } from '../../../utils/data_base/firebase/authentication';
import { addTemplate } from '../../../utils/data_base/firebase/dao/templateDAO';
import { MdLibraryAdd, MdDelete } from 'react-icons/md';

import { useDropzone } from 'react-dropzone';

import { lerDoc } from '../../../utils/tools/docsUtils'

function Template() {
    const [errorStatus, setErrorStatus] = useState(null);

    // User
    const [user, setUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editedTemplate, setEditedTemplate] = useState({
        title: '',
        doc: null,
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
    }, []);


    // Drop Zone
    const [uploadStatus, setUploadStatus] = useState(null);

    const dropzoneStyles = {
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        console.log("acceptedFiles:", acceptedFiles);
        const file = acceptedFiles[0];
      
        const blob = new Blob([file], { type: file.type });
        const content = URL.createObjectURL(blob);
      
        setEditedTemplate({
          ...editedTemplate,
          doc: {
            content: content,
            name: file.name,
            type: file.type,
            size: file.size,
            uri: content,
            arrayBuffer: await file.arrayBuffer(), // Adicionado para obter o ArrayBuffer diretamente
          },
        });
      
        setUploadStatus('Documento enviado com sucesso!');
      }, [editedTemplate]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
    });

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
            doc: null,
            rout: [],
            keys: []
        });
    };

    const handleCardClick = (data) => {
        setDrawerOpen(true);

        setEditedTemplate((prevState) => ({
            ...prevState,
            title: data.title || '',
            doc: data.doc || null,
            rout: data.rout || [],
            keys: data.keys || [],
        }));
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditedTemplate({
            title: '',
            doc: null,
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

        // Validar se há um documento
        if (!editedTemplate.doc || !editedTemplate.doc.name) {
            setErrorStatus('Por favor, envie um documento.');
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

        teste()

        // Todas as validações passaram, você pode prosseguir com a lógica de salvamento
        setErrorStatus(null)
        console.log('Saved Template:', editedTemplate);
        //closeDrawer();
    };

    const teste = async function () {
        await lerDoc(editedTemplate.doc)
        addTemplate(editedTemplate)
    }

    const handleDeleteTemplate = () => {
        // Handle logic for saving the edited template
        console.log('Delete Template:', editedTemplate);
        closeDrawer();
    };

    const handleAddSubAssunto = () => {
        setEditedTemplate({
            ...editedTemplate,
            rout: [...editedTemplate.rout, '']
        });
    };

    const handleRemoveFile = () => {
        setUploadStatus(null);
        setEditedTemplate({ ...editedTemplate, doc: null });
    };

    const handleAddKey = () => {
        setEditedTemplate(prevState => {
            const updatedKeyhandleAddKeys = prevState.keys
                ? [...prevState.keys, { name: '', type: 'texto' }]
                : [{ name: '', type: 'texto' }];

            return {
                ...prevState,
                keys: updatedKeyhandleAddKeys,
                doc: prevState.doc || null,
                rout: prevState.rout || [],
            };
        });
    };

    const handleRemoveSubAssunto = (index) => {
        setEditedTemplate((prevState) => {
            const updatedRout = [...prevState.rout];
            updatedRout.splice(index, 1);

            return {
                ...prevState,
                rout: updatedRout,
                doc: prevState.doc || null,
                keys: prevState.keys || [],
            };
        });
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


    const dataFake = [
        { title: "Template 1", doc: "Doc_1", rout: ["a", "b", "c"], keys: [{ name: "nome 1", type: "Texto" }, { name: "nome 2", type: "Texto" }, { name: "nome 3", type: "Texto" }, { name: "nome 4", type: "Texto" }, { name: "nome 5", type: "Texto" },] },
        { title: "Template 2", doc: "Doc_2", rout: ["Assunto 1", "Assunto 2", "Assunto 3", "Assunto 4", "Assunto 5", "Assunto 6"] },
        { title: "Template 3", doc: "Doc_3", rout: ["Assunto 1", "Assunto 2", "Assunto 3", "Assunto 4", "Assunto 5", "Assunto 6"] },
        { title: "Template 4", doc: "Doc_4", rout: ["Assunto 1", "Assunto 2", "Assunto 3", "Assunto 4", "Assunto 5", "Assunto 6"] },
        { title: "Template 5", doc: "Doc_5", rout: ["Assunto 1", "Assunto 2", "Assunto 3", "Assunto 4", "Assunto 5", "Assunto 6"] },
    ]

    return (
        <div className={`Template`}>
            <Header user={user} />

            <div className='title'>
                <h1>Templates</h1>
                <MdLibraryAdd className='bt-add-template' onClick={handleAddTemplateClick} />
            </div>

            <div className='grd_templates'>
                {dataFake.map((template, index) => (
                    <CardTemplate key={index} data={template} onClick={() => handleCardClick(template)} />
                ))}
            </div>

            {drawerOpen && (
                <div className='drawer_template'>
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
                            <label>
                                Documento (.doc):
                                <div className="file-preview" >
                                    <div {...getRootProps()} style={dropzoneStyles}>
                                        <input {...getInputProps()} />
                                        <p>Arraste e solte um arquivo DOC aqui ou clique para selecionar.</p>
                                    </div>
                                    {editedTemplate.doc && editedTemplate.doc.uri && (
                                        <embed src={editedTemplate.doc.uri} />
                                    )}
                                </div>
                            </label>
                        </div>
                        <div>
                            {uploadStatus && <p>{uploadStatus}</p>}
                        </div>
                        <div>
                            <label>Caminho:</label>
                            {editedTemplate.rout.map((subAssunto, index) => (
                                <div className='rout-item' key={index}>
                                    <input
                                        type='text'
                                        name={`rout.${index}`}
                                        value={subAssunto}
                                        onChange={handleInputChange}
                                    />
                                    {editedTemplate.rout.length === index + 1 && (
                                        <button className="bt-rout" onClick={handleAddSubAssunto}>+</button>
                                    )}
                                    {editedTemplate.rout.length === index + 1 && (
                                        <button className="bt-rout" onClick={() => handleRemoveSubAssunto(index)}>-</button>
                                    )}
                                </div>
                            ))}
                            {editedTemplate.rout.length === 0 && (
                                <button className="bt-rout" onClick={handleAddSubAssunto}>Adicionar Caminho</button>
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
                            {(!editedTemplate.doc || !editedTemplate.keys || editedTemplate.keys.length === 0) && (
                                <button onClick={handleAddKey}>Adicionar Chave do Documento</button>
                            )}
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
            )}
        </div>
    );
}

export default Template;