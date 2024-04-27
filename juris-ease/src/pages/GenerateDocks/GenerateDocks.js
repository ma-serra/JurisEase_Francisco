import './GenerateDocks.css';
import React, { useEffect, useState } from 'react';

import Header from "../../components/Header/Header";

import { getUser } from '../../utils/data_base/firebase/dao/userDAO';
import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication';
import { useNavigate } from 'react-router-dom';

import Stage01 from './Forms/Stage_01/Stage_01';
import Stage02 from './Forms/Stage_02/Stage_02';
import Stage03 from './Forms/Stage_03/Stage_03';
import Stage04 from './Forms/Stage_04/Stage_04';
import Stage05 from './Forms/Stage_05/Stage_05';
import { getTemplates } from '../../utils/data_base/firebase/dao/templateDAO';
import { compareArrays, gerarDOC, gerarPDF, refactoreHTMLtoPDF } from '../../utils/tools/tools';

function GenerateDocks() {
    const [content, setContent] = useState('')
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [templateBase, setTemplateBase] = useState({})
    const [currentStage, setCurrentStage] = useState(1);
    const [openFormatFile, setOpenFormatFile] = useState(false)

    const handleNext = () => {
        setCurrentStage(prevStage => prevStage < 5 ? prevStage + 1 : prevStage);
    };

    const handleBack = () => {
        setCurrentStage(prevStage => prevStage > 1 ? prevStage - 1 : prevStage);
    };

    const renderStage = () => {
        switch (currentStage) {
            case 1:
                return <Stage01 form={form} setForm={setForm} />;
            case 2:
                return <Stage02 form={form} setForm={setForm} />;
            case 3:
                return <Stage03 form={form} setForm={setForm} />;
            case 4:
                return <Stage04 form={form} setForm={setForm} templateBase={templateBase} />;
            case 5:
                return <Stage05 form={form} setForm={setForm} templateBase={templateBase} content={content} setContent={setContent} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (currentStage === 4) {
            const fetchData = async () => {
                try {
                    const templates = await new Promise((resolve, reject) => {
                        getTemplates(templates => resolve(templates), "base");
                    });

                    templates.forEach(template => {
                        if (matchTemplate(template)) {
                            console.log("Template correspondente encontrado:", template);
                            setTemplateBase(template);
                            return; // Interrompe o loop após encontrar uma correspondência
                        }
                    });

                    console.log("Nenhum template base corresponde às entradas!");
                } catch (error) {
                    console.error("Erro ao obter templates:", error);
                }
            };

            fetchData();
        }
    }, [currentStage]);

    // Função para verificar correspondência de um template
    function matchTemplate(template) {
        // Verifica se o tipo de rescisão coincide
        const typeTerminationMatch = template.typeTermination === form['{{tipo_recisao}}'];
        // Verifica se o número de reclamações coincide
        const numberOfComplaintsMatch = template.numberOfComplaints == form.reclamadas.length;
        // Verifica se os tipos de responsabilidade coincidem
        const typesResponsibilitiesMatch = compareArrays(
            form.reclamadas.map(rec => rec['{{tipo_responsabilidade}}']),
            template.typesResponsibilities
        );

        console.log(typeTerminationMatch, numberOfComplaintsMatch, typesResponsibilitiesMatch)
        // Retorna true se todas as condições forem atendidas
        return typeTerminationMatch && numberOfComplaintsMatch && typesResponsibilitiesMatch;
    }


    useEffect(() => {
        const fetchData = async () => {
            const isAuthenticated = isUserAuthenticated();

            if (isAuthenticated) {
                const userData = await getUser(isAuthenticated);
                setForm(prevForm => ({
                    ...prevForm,
                    '{{nome_usuario}}': userData.name || '',
                    '{{email_usuario}}': userData.email || '',
                    '{{oab_usuario}}': userData.oab || '',
                    '{{telefone_usuario}}': userData.phoneNumber || '',
                    '{{endereco_usuario}}': userData.address ? `${userData.address.street}, ${userData.address.number}, ${userData.address.city}, ${userData.address.state}, ${userData.address.cep}` : '',
                    '{{tipo_usuario}}': userData.type === 'client' ? 'cliente' : 'advogado' || '',
                }));
                setUser(userData);
            }
        };

        fetchData();
    }, []);

    const navigate = useNavigate();
    const navigateTo = (link) => {
        navigate(`/${link}`);
    };

    const breakAcess = () => {
        while (!user) {
            setTimeout(500)
        }

        if (!user.permissions.document_generation) {
            alert('Usuario não tem permissão de acesso a essa página!')
            navigateTo('')
        }
    }

    function handleProcessFile() {
        setOpenFormatFile(!openFormatFile)
        console.log(form)
    }

    const generatePDF = async () => {
        try {
            const data = refactoreHTMLtoPDF(content)
            await gerarPDF(data);

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
        }
    };

    const generateDocx = async () => {
        try {
            const data = refactoreHTMLtoPDF(content)
            await gerarDOC(data);

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
        }
    };

    return (
        <div className="GenerateDocks">
            <Header user={user} />

            {user && (
                breakAcess()
            )}

            <button className='bt-cancel'>
                <p>{currentStage === 5 ? "Iniciar novo documento" : "Cancelar"}</p>
            </button>

            <div className='progress'>
                {[1, 2, 3, 4, 5].map(stageNum => (
                    <React.Fragment key={stageNum}>
                        <div className={`stage${stageNum === currentStage ? "-current" : (stageNum < currentStage ? "-pass" : "")}`}>{stageNum.toString().padStart(2, '0')}</div>
                        {stageNum !== 5 && <div className="line"></div>}
                    </React.Fragment>
                ))}
            </div>

            {renderStage()}

            <div className='buttons-navigation'>
                {currentStage !== 1 && (
                    <button className='bt-back' onClick={handleBack}>
                        <p>Voltar</p>
                    </button>
                )}
                {currentStage !== 5 && (
                    <button className='bt-next' onClick={handleNext}>
                        <p>Avançar</p>
                    </button>
                )}

                {currentStage === 5 && (
                    <button className='bt-next' onClick={handleProcessFile}>
                        <p>Gerar arquivo</p>
                    </button>
                )}

                {openFormatFile && (
                    <div className='bts-generate'>
                        <button className='bt-generate' onClick={generateDocx}>
                            <p>DOC Format</p>
                        </button>

                        <button className='bt-generate' onClick={generatePDF}>
                            <p>PDF Format</p>
                        </button>
                    </div>

                )}

            </div>
        </div>
    );
}

export default GenerateDocks;
