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

    const handleProcessarArquivo = async () => {
        console.log("data:", templateSelected.content)
        try {
            const data = refactoreHTMLtoPDF(templateSelected.content)
            const url = await gerarPDF(data);
            setPdfUrl(url);
            console.log("URL do PDF:", url);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
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
            <div className="main-section">

                <div className="drawer">
                    <h2>Selecione um documento</h2>
                    <form>
                        <div>
                            <label>
                                Caminho:
                                <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => resetRout()}>
                                    {" ..."}
                                    <span>
                                        {" > "}
                                    </span>
                                </span>
                                {rout.map((rt, index) => (
                                    <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => undoRout(index)}>
                                        {rt}
                                        <span key={index}>
                                            {' > '}
                                        </span>
                                    </span>
                                ))}
                            </label>
                            <select name={`rout`} value={rout[rout.length - 1] || ''} onChange={handleChangeRout}>
                                {options.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </form>

                    <div className='content-cards'>
                        {filteredTemplates.map((template, index) => (
                            <CardTemplate key={index} data={template} onClick={() => handleCardClick(template)} />
                        ))}
                    </div>

                </div>
                <div className='templateForm'>
                    <h2>Template Form</h2>
                    {templateSelected &&
                        <div>
                            {templateSelected.keys.map((key, index) => (
                                <div className='key-input' key={index}>
                                    <label htmlFor="name">{key.name}</label>
                                    <input id="name" type='text' />
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

                <div className="preview">
                    <h2>Preview</h2>
                    <div className='sheet'>
                        {templateSelected && (
                            <div className='content' dangerouslySetInnerHTML={{ __html: templateSelected.content }} />
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
