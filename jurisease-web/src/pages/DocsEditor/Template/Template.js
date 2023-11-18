import './Template.css';
import React, { useCallback, useEffect, useState } from 'react';

import Header from '../../../components/Header/Header';
import CardTemplate from './CardTemplate/CardTemplate';
import { getUser } from '../../../utils/data_base/firebase/dao/userDAO';
import { isUserAuthenticated } from '../../../utils/data_base/firebase/authentication';
import { convertDocxToPdf, savePdf } from '../../../utils/tools';

import { MdLibraryAdd, MdDelete } from 'react-icons/md';

import { useDropzone } from 'react-dropzone';

function Template() {
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
            if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                console.log('Convertendo para PDF:', file);
    
                try {
                    console.log("docx:", file)
                    const pdf = await convertDocxToPdf(file);
                    console.log("pdf:", pdf)
    
                    if (pdf) {
                        // Se o PDF foi gerado com sucesso, atualiza o estado
                        setEditedTemplate({
                            ...editedTemplate,
                            doc: pdf,
                        });
                    } else {
                        throw new Error("Erro ao gerar arquivo!");
                    }
    
                } catch (error) {
                    console.error('Erro ao converter DOCX para PDF:', error);
                    setUploadStatus('Erro ao converter o documento para PDF. Tente novamente.');
                }
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
        multiple: false,  // Adicione esta propriedade para garantir apenas um arquivo por vez
    });

    // Formulário
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
        } else {
            setEditedTemplate({ ...editedTemplate, [name]: value });
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
        // Handle logic for saving the edited template
        console.log('Saved Template:', editedTemplate);
        closeDrawer();
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

    const dataFake = [
        { title: "Template 1", doc: "Doc_1", rout: ["Assunto 1", "Assunto 2", "Assunto 3", "Assunto 4", "Assunto 5", "Assunto 6"] },
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
                        <label>
                            Titulo:
                            <input
                                type='text'
                                id='title'
                                value={editedTemplate?.title || ''}
                                onChange={handleInputChange}
                            />
                        </label>
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
                        {uploadStatus && <p>{uploadStatus}</p>}
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
                        </div>
                    </form>

                    <div className='template-bts-act'>
                        <button className="bt-cancelar" onClick={closeDrawer}>Cancelar</button>
                        <button className="bt-aplicar" onClick={handleSaveTemplate}>Aplicar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Template;