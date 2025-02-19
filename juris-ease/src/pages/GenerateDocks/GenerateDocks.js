import './GenerateDocks.css';
import React, { useEffect, useRef, useState } from 'react';

import Header from "../../components/Header/Header";

import { useNavigate } from 'react-router-dom';

import Stage01 from './Forms/Stage_01/Stage_01';
import Stage02 from './Forms/Stage_02/Stage_02';
import Stage03 from './Forms/Stage_03/Stage_03';
import Stage04 from './Forms/Stage_04/Stage_04';
import Stage05 from './Forms/Stage_05/Stage_05';
import { getTemplates } from '../../utils/data_base/firebase/dao/templateDAO';
import { compareArrays, expireAccess, gerarDOC, gerarPDF } from '../../utils/tools/tools';
import AlertDialog from '../../components/Popups/AlertDialog/AlertDialog';


function GenerateDocks({ user }) {
    const [content, setContent] = useState('')
    const contentRef = useRef(null);

    const [templateBase, setTemplateBase] = useState({})
    const [templatesSelected, setTemplatesSelected] = useState([]);
    const [currentStage, setCurrentStage] = useState(1);
    const [openFormatFile, setOpenFormatFile] = useState(false)
    const dataAtual = new Date();

    const resetGeration = () => {
        setContent('');
        setTemplateBase({});
        setTemplatesSelected([]);
        setCurrentStage(1);
    };

    const handleResetGeration = () => {
        AlertDialog.show(
            'Tem certeza de que deseja resetar a geração?',
            resetGeration,
            () => console.log('canceled')
        );
    };

    const cancelGeration = () => {
        navigateTo('');
    };

    const handleCancelGeration = () => {
        AlertDialog.show(
            'Tem certeza de que deseja cancelar a geração?',
            cancelGeration,
            () => console.log('canceled')
        );
    };

    const [form, setForm] = useState({
        'data_atual': dataAtual.toLocaleDateString(),
        'data_atual_extenso': dataAtual.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }),
        'data_atual.ano': dataAtual.getFullYear().toString(),
        'data_atual.ano_extenso': dataAtual.toLocaleDateString('pt-BR', { year: 'numeric' }),
        'data_atual.mes': (dataAtual.getMonth() + 1).toString(),
        'data_atual.mes_extenso': dataAtual.toLocaleDateString('pt-BR', { month: 'long' }),
        'data_atual.dia': dataAtual.getDate().toString(),
        'data_atual.dia_extenso': dataAtual.toLocaleDateString('pt-BR', { weekday: 'long' }),
    });

    const handleNext = () => {
        setCurrentStage(prevStage => prevStage < 5 ? prevStage + 1 : prevStage);
    };

    const handleBack = () => {
        setOpenFormatFile(false)
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
                return <Stage05
                    form={form} setForm={setForm}
                    templateBase={templateBase} content={content} setContent={setContent}
                    templates={templatesSelected} setTemplates={setTemplatesSelected}
                    contentRef={contentRef}
                />;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (currentStage === 3) {
            let reclamadas = form.reclamadas
            reclamadas.forEach((reclamada, index) => {
                setForm(prevForm => ({
                    ...prevForm,
                    [`reclamada.${index + 1}.nome`]: reclamada['nome'],
                    [`reclamada.${index + 1}.tipo_responsabilidade`]: reclamada['tipo_responsabilidade'],
                    [`reclamada.${index + 1}.num_cpf_cnpj`]: reclamada['num_cpf_cnpj'],
                    [`reclamada.${index + 1}.endereco`]: reclamada['endereco'],
                }));
            })
        }

        if (currentStage === 4) {
            const fetchData = async () => {
                const templates = await new Promise((resolve, reject) => {
                    getTemplates(templates => resolve(templates), "base");
                });

                const templateFind = templates.filter(template => matchTemplate(template))[0];

                if (!templateFind?.id) {
                    showAlertTemplateNotFound()
                }

                setTemplateBase(templateFind)
            };

            fetchData();
        }
    }, [currentStage]);

    function showAlertTemplateNotFound() {
        const tipoRescisao = form['tipo_rescisao'];
        const numeroReclamadas = form.reclamadas.length;
        const tiposReclamadas = form.reclamadas.map(rec => rec['tipo_responsabilidade']).join(', ');

        AlertDialog.show(
            `Nenhum template foi encontrado, para a configuração fornecida: <br />` +
            `Tipo de rescisão: ${tipoRescisao} <br />` +
            `Número de reclamadas: ${numeroReclamadas} <br />` +
            `Tipos: ${tiposReclamadas}`,
            () => setCurrentStage(3),
            () => setCurrentStage(3)
        );
    }

    // Função para verificar correspondência de um template
    function matchTemplate(template) {
        // Verifica se o tipo de rescisão coincide
        const typeTerminationMatch = template.typeTermination === form['tipo_rescisao'];
        // Verifica se o número de reclamações coincide
        const numberOfComplaintsMatch = template.numberOfComplaints == form.reclamadas.length;
        // Verifica se os tipos de responsabilidade coincidem
        const typesResponsibilitiesMatch = compareArrays(
            form.reclamadas.map(rec => rec['tipo_responsabilidade']),
            template.typesResponsibilities
        );

        // Retorna true se todas as condições forem atendidas
        return typeTerminationMatch && numberOfComplaintsMatch && typesResponsibilitiesMatch;
    }

    useEffect(() => {
        setForm(prevForm => ({
            ...prevForm,
            'nome_usuario': user.name || '',
            'email_usuario': user.email || '',
            'tipo_usuario': user.type === 'client' ? 'cliente' : 'advogado' || '',
            'oab_usuario': user.oab || '',
            'telefone_usuario': user.phoneNumber || '',
            'cep_usuario': user.address?.cep || '',
            'estado_usuario': user.address?.state || '',
            'cidade_usuario': user.address?.city || '',
            'logradouro_usuario': user.address?.state || '',
            'numero_casa_usuario': user.address?.street || '',
            'endereco_usuario': user.address ? `${user.address.street}, ${user.address.number}, ${user.address.city}, ${user.address.state}, ${user.address.cep}` : '',
        }));
    }, [user.address, user.email, user.name, user.oab, user.phoneNumber, user.type])

    function handleProcessFile() {
        setOpenFormatFile(!openFormatFile)
    }

    const generatePDF = async () => {
        setOpenFormatFile(false)
        try {
            const htmlContent = contentRef.current.innerHTML;
            await gerarPDF(htmlContent);

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
        }
    };

    const generateDocx = async () => {
        setOpenFormatFile(false)
        try {
            const htmlContent = contentRef.current.innerHTML;
            await gerarDOC(htmlContent);

        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
        }
    };

    useEffect(() => {
        if (!user) return;

        const checkAccess = () => {
            if (!user.permissions?.document_generation) {
                alert('Usuario não tem permissão de acesso a essa página!');
                navigateTo('');
                return;
            }

            if (expireAccess(user.expirationDate)) {
                alert('Seu acesso expirou, por favor renove seu acesso!');
                navigateTo('');
                return;
            }
        };

        checkAccess();
    }, [user]);

    //useReloadListener();

    const navigate = useNavigate();
    const navigateTo = (link) => {
        navigate(`/${link}`);
    };

    return (
        <div className="GenerateDocks">
            <Header user={user} />

            <button className='bt-cancel' onClick={currentStage === 5 ? handleResetGeration : handleCancelGeration}>
                <p>{currentStage === 5 ? "Iniciar novo" : "Cancelar"}</p>
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
