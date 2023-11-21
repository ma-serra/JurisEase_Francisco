import './Template.css';
import React, { useCallback, useEffect, useState } from 'react';

import Header from '../../../components/Header/Header';
import CardTemplate from './CardTemplate/CardTemplate';
import { getUser } from '../../../utils/data_base/firebase/dao/userDAO';
import { isUserAuthenticated } from '../../../utils/data_base/firebase/authentication';

import { MdLibraryAdd, MdDelete } from 'react-icons/md';

import { useDropzone } from 'react-dropzone';

function Template() {
    const [errorStatus, setErrorStatus] = useState(null);

    // User
    const [user, setUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editedTemplate, setEditedTemplate] = useState({
        title: '',
        doc: null,
        rout: []
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
        const file = acceptedFiles[0];
        const uploadSuccessful = true; // Substitua por sua lógica real

        if (uploadSuccessful) {
            setUploadStatus('Documento enviado com sucesso!');

            // Verifica se o arquivo é um documento do Word (.doc)
            if (file.type !== "application/pdf") {
                setUploadStatus('O arquivo não é do tipo .pdf!');

            } else {
                setEditedTemplate({
                    ...editedTemplate,
                    doc: {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        uri: window.URL.createObjectURL(file),
                    },
                });
            }
        } else {
            setUploadStatus('Falha ao enviar o documento. Tente novamente.');
        }
    }, [editedTemplate]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: 'application/pdf',
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
        } else if (name.startsWith('doc.keys.')) {
            const keyParts = name.split('.');
            const keyIndex = parseInt(keyParts[2], 10);
            const keyProperty = keyParts[3];
    
            setEditedTemplate((prevState) => {
                const updatedDocKeys = prevState.doc && prevState.doc.keys
                    ? [...prevState.doc.keys]
                    : [];
    
                if (updatedDocKeys[keyIndex]) {
                    updatedDocKeys[keyIndex] = {
                        ...updatedDocKeys[keyIndex],
                        [keyProperty]: value
                    };
                }
    
                return {
                    ...prevState,
                    doc: {
                        ...prevState.doc,
                        keys: updatedDocKeys
                    }
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
            rout: []
        });
    };

    const handleCardClick = (data) => {
        setDrawerOpen(true);
        setEditedTemplate({ ...data });
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setEditedTemplate({
            title: '',
            doc: null,
            rout: []
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
            editedTemplate.doc.keys &&
            editedTemplate.doc.keys.length > 0 &&
            editedTemplate.doc.keys.some(key => !key.name.trim())
        ) {
            setErrorStatus('Por favor, preencha todas as chaves do documento.');
            return;
        }
    
        // Todas as validações passaram, você pode prosseguir com a lógica de salvamento
        setErrorStatus(null)
        console.log('Saved Template:', editedTemplate);
        //closeDrawer();
    };
    


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

    const handleRemoveSubAssunto = (index) => {
        const updatedRout = [...editedTemplate.rout];
        updatedRout.splice(index, 1);

        setEditedTemplate({
            ...editedTemplate,
            rout: updatedRout
        });
    };

    const handleRemoveFile = () => {
        setUploadStatus(null);
        setEditedTemplate({ ...editedTemplate, doc: null });
    };

    const handleAddDocKey = () => {
        setEditedTemplate(prevState => {
            const updatedDocKeys = prevState.doc && prevState.doc.keys
                ? [...prevState.doc.keys, { name: '', type: 'texto' }]
                : [{ name: '', type: 'texto' }];

            return {
                ...prevState,
                doc: {
                    ...prevState.doc,
                    keys: updatedDocKeys
                }
            };
        });
    };

    const handleRemoveDocKey = (index) => {
        setEditedTemplate(prevState => {
            const updatedDocKeys = prevState.doc && prevState.doc.keys
                ? prevState.doc.keys.filter((key, i) => i !== index)
                : [];

            return {
                ...prevState,
                doc: {
                    ...prevState.doc,
                    keys: updatedDocKeys
                }
            };
        });
    };

    const dataFake = [
        { title: "Template 1", doc: "Doc_1", rout: [] },
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
                                    <embed src={editedTemplate.doc.uri} type='application/pdf' />
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
                                    {editedTemplate.rout.length > 1 && (
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
                            {editedTemplate.doc && editedTemplate.doc.keys && editedTemplate.doc.keys.map((key, index) => (
                                <div className='doc-key-item' key={index}>
                                    <input
                                        type='text'
                                        name={`doc.keys.${index}.name`}
                                        placeholder='Chave'
                                        value={key.name}
                                        onChange={handleInputChange}
                                    />
                                    <select
                                        name={`doc.keys.${index}.type`}
                                        value={key.type}
                                        onChange={handleInputChange}
                                    >
                                        <option value='texto'>Texto</option>
                                        <option value='monetário'>Monetário</option>
                                        <option value='data'>Data</option>
                                        <option value='inteiro'>Inteiro</option>
                                        {/* Adicione outros tipos conforme necessário */}
                                    </select>
                                    {editedTemplate.doc.keys.length === index + 1 && (
                                        <button className="bt-rout" onClick={handleAddDocKey}>+</button>
                                    )}
                                    {editedTemplate.doc.keys.length > 1 && (
                                        <button className="bt-rout" onClick={() => handleRemoveDocKey(index)}>-</button>
                                    )}
                                </div>
                            ))}
                            {(!editedTemplate.doc || !editedTemplate.doc.keys || editedTemplate.doc.keys.length === 0) && (
                                <button className="bt-rout" onClick={handleAddDocKey}>Adicionar Chave do Documento</button>
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