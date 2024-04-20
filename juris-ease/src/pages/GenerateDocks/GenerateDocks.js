import './GenerateDocks.css';
import React, { useEffect, useState } from 'react';

import Header from "../../components/Header/Header";
import CardTemplate from '../../components/Cards/CardTemplate/CardTemplate';
import SheetPreview from '../../components/SheetPreview/SheetPreview';

import { getUser } from '../../utils/data_base/firebase/dao/userDAO';
import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication';
import { getTemplates } from '../../utils/data_base/firebase/dao/templateDAO';
import { removeObjetosVazios, gerarPDF, refactoreHTMLtoPDF, gerarDOC } from '../../utils/tools/tools'
import { useNavigate } from 'react-router-dom';
import Stage01 from './Forms/Stage_01/Stage_01';
import Stage02 from './Forms/Stage_02/Stage_02';

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
            const url = await gerarDOC(data);
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
            }, "specific");
        };

        fetchData();
    }, []); // Adicione um array de dependências vazio para garantir que o useEffect seja executado apenas uma vez

    useEffect(() => {
        update(); // Chama a função update quando templates ou rout mudarem

    }, [templates, rout]); // Adicione templates e rout ao array de dependências

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

    return (
        <div className="GenerateDocks">
            <Header user={user} />

            {user && (
                breakAcess()
            )}

            <button className='bt-cancel'>
                <p>Cancelar</p>
            </button>

            <div className='progress'>
                <div class="stage">01</div>
                <div class="line"></div>
                <div class="stage">02</div>
                <div class="line"></div>
                <div class="stage">03</div>
                <div class="line"></div>
                <div class="stage">04</div>
                <div class="line"></div>
                <div class="stage">05</div>
            </div>

            <Stage02 />

            <div className='buttons-navigation'>
                <button className='bt-back'>
                    <p>voltar</p>
                </button>
                <button className='bt-next'>
                    <p>avançar</p>
                </button>
            </div>
        </div>
    );
}

export default GenerateDocks;
