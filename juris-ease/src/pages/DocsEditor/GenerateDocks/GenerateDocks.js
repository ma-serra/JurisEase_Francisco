// Importe os estilos
import './GenerateDocks.css';

// Importe as bibliotecas necessárias
import Header from "../../../components/Header/Header";
import CardTemplate from '../Template/CardTemplate/CardTemplate';
import React, { useEffect, useState } from 'react';

import { getUser } from '../../../utils/data_base/firebase/dao/userDAO';
import { isUserAuthenticated } from '../../../utils/data_base/firebase/authentication';
import { getTemplates } from '../../../utils/data_base/firebase/dao/templateDAO';
import { removeObjetosVazios, gerarPDF, refactoreHTMLtoPDF } from '../../../utils/tools/tools'

const filterTemplatesByRout = (rout, templates) => {
    let filteredTemplates = [...templates];

    rout.forEach((routSection, index) => {
        filteredTemplates = filteredTemplates.filter((template) => template.rout[index] === routSection);
    });

    return filteredTemplates;
};

const getRoutOptions = (rout, templates) => {
    const result = templates.map((template) => template.rout[rout.length]);
    return result
};

function GenerateDocks() {
    const [user, setUser] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFiltredTemplates] = useState([]);
    const [templateSelected, setTemplate] = useState(null);
    const [rout, setRout] = useState([])
    const [options, setOptions] = useState([])
    const [resultado, setResultado] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [form, setForm] = useState({})
    const [content, setContent] = useState('')

    const handleProcessarArquivo = async () => {
        try {
            const data = refactoreHTMLtoPDF(content)
            const url = await gerarPDF(data);
            setPdfUrl(url);
            console.log("URL do PDF:", url);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
        }
    };

    function replaceKeys(keys) {
        let content = templateSelected.content;

        Object.keys(keys).forEach(key => {
            const regex = new RegExp('{{' + key + '}}', 'g');
            content = content.replace(regex, keys[key]);
        });

        return content;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('key.')) {
            const key = name.split('.')[1]; // key.name
            setForm({
                ...form,
                [key]: value
            });

            setContent(replaceKeys({ ...form, [key]: value }));
        }
    };

    const update = () => {
        const filter = filterTemplatesByRout(rout, templates)
        setFiltredTemplates(filter)
        setOptions(getRoutOptions(rout, filter))
    }

    const handleChangeRout = (event) => {
        const selectedRout = event.target.value;
        setRout((prevRout) => [...prevRout, selectedRout]);
    };

    const undoRout = (index) => {
        setRout((prevRout) => prevRout.slice(0, index + 1));
    };

    const resetRout = (index) => {
        setRout([]);
    };

    const handleCardClick = ({ id, title, content, rout, keys }) => {
        setTemplate((prevState) => ({
            ...prevState,
            id: id || null,
            title: title || '',
            content: content || '',
            rout: rout || [],
            keys: keys || [],
        }));

        setContent(content)
        clearInputs()
    };

    const clearInputs = () => {
        const inputElements = document.querySelectorAll('.key-input input');
        inputElements.forEach(input => {
            input.value = ''; // Limpa o valor do input
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            const isAuthenticated = isUserAuthenticated();

            if (isAuthenticated) {
                const userData = await getUser(isAuthenticated);
                setUser(userData);
            }

            getTemplates((templatesData) => {
                const templates = removeObjetosVazios(templatesData);
                setTemplates(templates);
            });
        };

        fetchData();
    }, []); // Adicione um array de dependências vazio para garantir que o useEffect seja executado apenas uma vez

    useEffect(() => {
        update(); // Chama a função update quando templates ou rout mudarem

    }, [templates, rout]); // Adicione templates e rout ao array de dependências

    return (
        <div className="GenerateDocks">
            <Header user={user} />
            <div className="document-generator">

                <div className="content-templates">
                    <h2>Selecione seus templates</h2>

                    <div className='rout-path'>
                        <form>
                            <label>
                                <span className="path-span" onClick={() => resetRout()}> {'Templates'} </span>
                                <span> {' / '} </span>

                                {rout.map((rt, index) => (
                                    <>
                                        <span key={index} className="path-span" onClick={() => undoRout(index)}>
                                            {rt}
                                        </span>
                                        <span> {' / '} </span>
                                    </>
                                ))}
                            </label>

                            <select name={`rout`} value={rout[rout.length - 1] || ''} onChange={handleChangeRout} className="select-option">
                                <option value="">Selecione</option> {/* Mensagem "Selecione" */}
                                {options.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </form>
                    </div>

                    <div className='content-cards'>
                        {filteredTemplates.map((template, index) => (
                            <CardTemplate key={index} data={template} onClick={() => handleCardClick(template)} />
                        ))}
                    </div>

                </div>

                <div className='content-form'>
                    <h2>Template Form</h2>
                    {templateSelected &&
                        <div>
                            {templateSelected.keys.map((key, index) => (
                                <div className='key-input' key={index}>
                                    <label htmlFor="name">{key.name}</label>
                                    <input
                                        type='text'
                                        name={`key.${key.name}`}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            ))}
                            <button onClick={handleProcessarArquivo}>Processar Arquivo</button>

                            {resultado && resultado.success && (
                                <div>
                                    <p>Arquivo processado com sucesso. Caminho de saída: {resultado.outputFilePath}</p>
                                    <p>Resposta da solicitação HTTP: {JSON.stringify(resultado.responseData)}</p>
                                </div>
                            )}

                            {resultado && !resultado.success && (
                                <p>Falha ao processar arquivo. Erro: {JSON.stringify(resultado.error)}</p>
                            )}
                        </div>
                    }
                </div>

                <div className="content-preview">
                    <h2>Preview</h2>
                    <div className='sheet'>
                        {templateSelected && (
                            <div className='content' dangerouslySetInnerHTML={{ __html: content }} />
                        )}
                    </div>

                </div>

            </div>

            {/* Drawer inferior para progresso e navegação */}
            <div className="bottom-drawer">
                {/* Seção de progresso */}

            </div>
        </div>
    );
}

export default GenerateDocks;
