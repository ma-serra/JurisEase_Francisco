import './ManegeUsers.css'
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication';
import { getUser, getUsers, updateUser } from '../../utils/data_base/firebase/dao/userDAO';
import Header from '../../components/Header/Header';
import { FaPencilAlt } from 'react-icons/fa';
import { AiFillCaretLeft, AiFillCaretRight, AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { checkBlocked, convertDateToPtBr } from '../../utils/tools/tools';


function ManegeUsers() {

    const [user, setUser] = useState(null);
    const [formUser, setFormUser] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalClients, setTotalClients] = useState(0);
    const [totalLawyers, setTotalLawyers] = useState(0);

    async function buscarUsuarios() {
        try {
            const usersData = await getUsers();
            console.log("Users:", usersData);
            setUsers(usersData);
            return usersData;
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return [];
        }
    }

    async function obterEstatisticasUsuarios() {
        try {
            const usersData = await buscarUsuarios();
            const totalUsersData = usersData.length;
            const totalClientsData = usersData.filter(user => user.type === 'client').length;
            const totalLawyersData = usersData.filter(user => user.type === 'lawyer').length;
            setTotalUsers(totalUsersData);
            setTotalClients(totalClientsData);
            setTotalLawyers(totalLawyersData);
            return { totalUsers: totalUsersData, totalClients: totalClientsData, totalLawyers: totalLawyersData };

        } catch (error) {
            console.error('Erro ao obter estatísticas de usuários:', error);
            return { totalUsers: 0, totalClients: 0, totalLawyers: 0 };
        }
    }

    const handleSubmitForm = async (event) => {
        event.preventDefault();
        checkBlocked(formUser)
        await updateUser(formUser)
        alert('Dados atualizados com sucesso!')
        window.location.reload();
    };

    const handleEdit = (userId) => {
        setFormUser(users.find(user => user.uid === userId))
    };

    const closeDrawerForm = (event) => {
        event.preventDefault();
        setFormUser({})
    }

    const handleInputChange = (event) => {
        const { id, value, type, checked } = event.target;
    
        setFormUser(prevState => {
            const updatedUser = { ...prevState };
    
            // Verificar se o campo é uma caixa de seleção
            const isCheckbox = type === 'checkbox';
    
            // Atualizar o valor do campo no estado do usuário do formulário
            if (isCheckbox) {
                updatedUser.permissions[id] = checked;
            } else {
                updatedUser[id] = value;
            }
    
            return updatedUser;
        });
    };

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(() => {
        obterEstatisticasUsuarios();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const navigate = useNavigate();
    const navigateTo = (link) => {
        navigate(`/${link}`);
    };

    const breakAcess = () => {
        while (!user) {
            setTimeout(500)
        }

        if (!user.permissions.manege_users) {
            alert('Usuario não tem permissão de acesso a essa página!')
            navigateTo('')
        }
    }

    // Lógica para calcular os índices do usuário atual exibido
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const isFirstPage = currentPage === 1;
    const isLastPage = indexOfLastUser >= totalUsers;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className={`ManegeUsers`}>
            {user && (
                breakAcess()
            )}

            <Header user={user} />

            <div className='content'>
                <div className='content-manegment'>
                    <h1>Gerenciamento de Usuários</h1>

                    <div className='infos'>
                        <div className='info-usuarios'>
                            <h1>{totalUsers}</h1>
                            <p>Total de usuários</p>
                        </div>

                        <div className='linha-sep' />

                        <div className='info-advogados'>
                            <h1>{totalLawyers}</h1>
                            <p>Total de advogados</p>
                        </div>

                        <div className='linha-sep' />

                        <div className='info-clientes'>
                            <h1>{totalClients}</h1>
                            <p>Total de clientes</p>
                        </div>
                    </div>

                    <div className='users-list-content'>
                        <div className='users-table'>
                            <div className='table-header'>
                                <p>Nome</p>
                                <p>E-mail</p>
                                <p>Tipo</p>
                                <p>Situação</p>
                                <p></p>
                            </div>
                            <div className='table-body'>
                                {/* Mapeamento dos usuários */}
                                {currentUsers.map((user) => (
                                    <div className={`user-row ${user.state === 'active' ? 'active' : 'inactive'}`} key={user.uid} onClick={() => handleEdit(user.uid)}>
                                        <p>{user.name}</p>
                                        <p>{user.email}</p>
                                        <p>{user.type}</p>
                                        <p>{user.state === 'active' ? 'ativo' : 'bloqueado'}</p>
                                        <p>
                                            <FaPencilAlt className="icon-pencil" />
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='navigation'>
                            {!isFirstPage && <AiFillStepBackward onClick={() => paginate(1)} />}
                            {!isFirstPage && <AiFillCaretLeft onClick={() => paginate(currentPage - 1)} />}
                            <p>{indexOfFirstUser + 1} - {Math.min(indexOfLastUser, totalUsers)} de {totalUsers}</p>
                            {!isLastPage && <AiFillCaretRight onClick={() => paginate(currentPage + 1)} />}
                            {!isLastPage && <AiFillStepForward onClick={() => paginate(Math.ceil(totalUsers / usersPerPage))} />}
                        </div>
                    </div>
                </div>

            </div>

            {formUser.uid && (
                <div className='drawer-user-managment'>
                    <form>
                        <label htmlFor='name'>
                            <p>Nome:</p>
                            <input
                                type='text'
                                id='name'
                                placeholder={formUser.name || ''}
                                disabled={true}
                            />
                        </label>

                        <label htmlFor='email'>
                            <p>E-mail:</p>
                            <input
                                type='email'
                                id='email'
                                placeholder={formUser.email || ''}
                                disabled={true}
                            />
                        </label>

                        <label htmlFor='createdAt'>
                            <p>Cadastrado em:</p>
                            <input
                                type='text'
                                id='createdAt'
                                placeholder={convertDateToPtBr(formUser.createdAt)}
                                disabled={true}
                            />
                        </label>

                        <label htmlFor='lastLogin'>
                            <p>Último Login:</p>
                            <input
                                type='text'
                                id='lastLogin'
                                placeholder={convertDateToPtBr(formUser.lastLoginAt)}
                                disabled={true}
                            />
                        </label>

                        <label htmlFor='type'>
                            <p>Tipo de conta:</p>
                            <select
                                id='type'
                                value={formUser.type || ''}
                                onChange={handleInputChange}
                            >
                                <option value='lawyer'>Advogado</option>
                                <option value='client'>Cliente</option>
                            </select>
                        </label>

                        {formUser.type === 'lawyer' && (
                            <label htmlFor='oab'>
                                <p>Número OAB:</p>
                                <input
                                    type='text'
                                    id='oab'
                                    value={formUser.oab || ''}
                                    onChange={handleInputChange}
                                />
                            </label>
                        )}
                        <label htmlFor='phone'>
                            <p>Telefone:</p>
                            <input
                                type='text'
                                id='phone'
                                placeholder={formUser.phoneNumber || ''}
                                disabled={true}
                            />
                        </label>

                        <label> <p>Endereço</p> </label>
                        <div className="address-fields">
                            <label htmlFor='cep'>
                                <p>CEP:</p>
                                <input
                                    type='text'
                                    id='cep'
                                    placeholder={formUser.address?.cep || ''}
                                    disabled={true}
                                />
                            </label>

                            <label htmlFor='state'>
                                <p>Estado:</p>
                                <input
                                    type='text'
                                    id='state'
                                    placeholder={formUser.address?.state || ''}
                                    disabled={true}
                                />
                            </label>

                            <label htmlFor='city'>
                                <p>Cidade:</p>
                                <input
                                    type='text'
                                    id='city'
                                    placeholder={formUser.address?.city || ''}
                                    disabled={true}
                                />
                            </label>

                            <label htmlFor='street'>
                                <p>Rua:</p>
                                <input
                                    type='text'
                                    id='street'
                                    placeholder={formUser.address?.street || ''}
                                    disabled={true}
                                />
                            </label>

                            <label htmlFor='number'>
                                <p>Número:</p>
                                <input
                                    type='text'
                                    id='number'
                                    placeholder={formUser.address?.number || ''}
                                    disabled={true}
                                />
                            </label>
                        </div>

                        <label> <p>Permissões</p> </label>
                        <div className="permissions-fields">
                            <label htmlFor='headlines'>
                                <p>Manchetes:</p>
                                <input
                                    type='checkbox'
                                    id='headlines'
                                    checked={formUser.permissions?.headlines || false}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='services'>
                                <p>Serviços:</p>
                                <input
                                    type='checkbox'
                                    id='services'
                                    checked={formUser.permissions?.services || false}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='templates'>
                                <p>Templates:</p>
                                <input
                                    type='checkbox'
                                    id='templates'
                                    checked={formUser.permissions?.templates || false}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='document_generation'>
                                <p>Gerador de Documentos</p>
                                <input
                                    type='checkbox'
                                    id='document_generation'
                                    checked={formUser.permissions?.document_generation || false}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='manege_users'>
                                <p>Gerenciador de Usuários:</p>
                                <input
                                    type='checkbox'
                                    id='manege_users'
                                    checked={formUser.permissions?.manege_users || false}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='acessAdmin'>
                                <p>Administrador:</p>
                                <input
                                    type='checkbox'
                                    id='acessAdmin'
                                    checked={formUser.permissions?.acessAdmin || false}
                                    onChange={handleInputChange}
                                />
                            </label>
                        </div>

                        <label htmlFor='expirationDate'>
                            <p>Data de expiração:</p>
                            <input
                                type='date'
                                id='expirationDate'
                                value={formUser.expirationDate || ''}
                                onChange={handleInputChange}
                            />
                        </label>

                        <div className='bts-actions'>
                            <button className='bt-cancel' onClick={closeDrawerForm}>
                                Cancelar
                            </button>

                            <button className='bt-apply' onClick={handleSubmitForm}>
                                Aplicar
                            </button>
                        </div>

                    </form>
                </div>
            )}

        </div>
    );
}

export default ManegeUsers;