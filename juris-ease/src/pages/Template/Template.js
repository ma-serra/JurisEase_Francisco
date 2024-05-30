import './Template.css';
import React, { useEffect, useState } from 'react';

import Header from '../../components/Header/Header';
import Search from '../../components/Search/Search';

import { getUser } from '../../utils/data_base/firebase/dao/userDAO';
import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication';
import { getTemplates } from '../../utils/data_base/firebase/dao/templateDAO';
import { MdLibraryAdd } from 'react-icons/md';
import { expireAccess, normalizeText } from '../../utils/tools/tools'
import { useNavigate } from 'react-router-dom';
import DrawerTemplate from './DrawerTemplate/DrawerTemplate';

function Template() {
    const [user, setUser] = useState(null);

    const [templatesBase, setTemplatesBase] = useState([]);
    const [templatesEspecific, setTemplatesEspecific] = useState([]);

    const [search, setSearch] = useState('');
    const [filtredTemplatesBase, setFiltredTemplatesBase] = useState(null)
    const [filtredTemplatesEspecific, setFiltredTemplatesEspecific] = useState(null)

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState("");
    const [drawerData, setDrawerData] = useState({});

    const filterCards = (filterText) => {
        const filteredBase = filterTemplates(templatesBase, filterText);
        const filteredEspecific = filterTemplates(templatesEspecific, filterText);

        setFiltredTemplatesBase(filteredBase);
        setFiltredTemplatesEspecific(filteredEspecific);
    };

    const filterTemplates = (templates, filterText) => {
        if (!filterText) {
            return null;
        }

        const searchText = normalizeText(filterText);

        return templates.filter(template => {
            const content = normalizeText(template.content);
            const title = normalizeText(template.title);
            const rout = normalizeText(template.rout);

            return title.includes(searchText) || content.includes(searchText) || rout.includes(searchText);
        });
    };

    const navigate = useNavigate();
    const navigateTo = (link) => {
        navigate(`/${link}`);
    };

    function handleAddTemplateClick(type) {
        setIsDrawerOpen(true);
        setDrawerType(type)
        setDrawerData({})
    };

    const handleCardClick = (data, type) => {
        setIsDrawerOpen(true);
        setDrawerType(type)
        setDrawerData(data)
    };

    useEffect(() => {
        filterCards(search.trim());
    }, [search]);

    useEffect(() => {
        if (!user) return;

        const checkAccess = () => {
            if (!user.permissions?.templates) {
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
                setTemplatesType(templatesData || []);
            }, type);
        };

        fetchTemplatesAndListen("base", setTemplatesBase);
        fetchTemplatesAndListen("specific", setTemplatesEspecific);
    }, [])

    return (
        <div className={`Template`}>
            <Header user={user} />

            {isDrawerOpen && (
                <DrawerTemplate type={drawerType} data={drawerData} onClose={() => setIsDrawerOpen(false)} />
            )}

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

                <div className='div-scroll'>
                    <div className='grd-templates'>
                        {(filtredTemplatesBase === null ? templatesBase : filtredTemplatesBase).length > 0 ? (
                            (filtredTemplatesBase === null ? templatesBase : filtredTemplatesBase).map((template, index) => (
                                <div key={index} className={`card`} onClick={() => handleCardClick(template, "base")}>
                                    <h1>{template.title}</h1>
                                    <p>{template.rout}</p>
                                </div>
                            ))
                        ) : (
                            <p>Nenhum template encontrado!</p>
                        )}
                    </div>
                </div>

                <div className='title-specific'>
                    <h1>Específicos</h1>
                    <MdLibraryAdd className='bt-add-template' onClick={() => (handleAddTemplateClick("specific"))} />
                </div>

                <div className='div-scroll'>
                    <div className='grd-templates'>
                        {(filtredTemplatesEspecific === null ? templatesEspecific : filtredTemplatesEspecific).length > 0 ? (
                            (filtredTemplatesEspecific === null ? templatesEspecific : filtredTemplatesEspecific).map((template, index) => (
                                <div key={index} className={`card`} onClick={() => handleCardClick(template, "specific")}>
                                    <h1>{template.title}</h1>
                                    <p>{template.rout}</p>
                                </div>
                            ))
                        ) : (
                            <p>Nenhum template encontrado!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Template;