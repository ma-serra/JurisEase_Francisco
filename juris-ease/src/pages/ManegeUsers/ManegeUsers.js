import './ManegeUsers.css'
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication';
import { getUser } from '../../utils/data_base/firebase/dao/userDAO';
import Header from '../../components/Header/Header';
import { FaPencilAlt } from 'react-icons/fa';
import { AiFillCaretLeft, AiFillCaretRight, AiFillStepBackward, AiFillStepForward } from "react-icons/ai";


function ManegeUsers() {

    const [user, setUser] = useState(null);
    const [formUser, setFormUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    const users = [
        { id: 1, nome: "Alice", email: "alice@example.com", tipo: "Cliente", situacao: "Ativo" },
        { id: 2, nome: "Bob", email: "bob@example.com", tipo: "Advogado", situacao: "Ativo" },
        { id: 3, nome: "Charlie", email: "charlie@example.com", tipo: "Advogado", situacao: "Bloquedo" },
        { id: 4, nome: "David", email: "david@example.com", tipo: "Cliente", situacao: "Ativo" },
        { id: 5, nome: "Emma", email: "emma@example.com", tipo: "Advogado", situacao: "Bloquedo" },
        { id: 6, nome: "Frank", email: "frank@example.com", tipo: "Advogado", situacao: "Ativo" },
        { id: 7, nome: "Grace", email: "grace@example.com", tipo: "Cliente", situacao: "Bloquedo" },
        { id: 8, nome: "Henry", email: "henry@example.com", tipo: "Advogado", situacao: "Ativo" },
        { id: 9, nome: "Isabella", email: "isabella@example.com", tipo: "Advogado", situacao: "Bloquedo" },
        { id: 10, nome: "Jack", email: "jack@example.com", tipo: "Cliente", situacao: "Ativo" },
        { id: 11, nome: "Katherine", email: "katherine@example.com", tipo: "Advogado", situacao: "Ativo" },
        { id: 12, nome: "Liam", email: "liam@example.com", tipo: "Cliente", situacao: "Bloquedo" },
        { id: 13, nome: "Mia", email: "mia@example.com", tipo: "Advogado", situacao: "Ativo" },
        { id: 14, nome: "Noah", email: "noah@example.com", tipo: "Advogado", situacao: "Bloquedo" },
        { id: 15, nome: "Olivia", email: "olivia@example.com", tipo: "Cliente", situacao: "Ativo" },
        { id: 16, nome: "Peter", email: "peter@example.com", tipo: "Advogado", situacao: "Bloquedo" },
        { id: 17, nome: "Quinn", email: "quinn@example.com", tipo: "Cliente", situacao: "Ativo" },
        { id: 18, nome: "Rachel", email: "rachel@example.com", tipo: "Advogado", situacao: "Ativo" },
        { id: 19, nome: "Samuel", email: "samuel@example.com", tipo: "Advogado", situacao: "Bloquedo" },
        { id: 20, nome: "Tiffany", email: "tiffany@example.com", tipo: "Cliente", situacao: "Ativo" },
        { id: 21, nome: "Uma", email: "uma@example.com", tipo: "Advogado", situacao: "Ativo" },
        { id: 22, nome: "Victor", email: "victor@example.com", tipo: "Cliente", situacao: "Bloquedo" },
        { id: 23, nome: "Wendy", email: "wendy@example.com", tipo: "Advogado", situacao: "Ativo" },
        { id: 24, nome: "Xander", email: "xander@example.com", tipo: "Advogado", situacao: "Bloquedo" },
        { id: 25, nome: "Yasmine", email: "yasmine@example.com", tipo: "Cliente", situacao: "Ativo" },
        { id: 26, nome: "Zoe", email: "zoe@example.com", tipo: "Advogado", situacao: "Bloquedo" },
        { id: 27, nome: "Adam", email: "adam@example.com", tipo: "Advogado", situacao: "Ativo" },
        { id: 28, nome: "Ben", email: "ben@example.com", tipo: "Cliente", situacao: "Ativo" },
        { id: 29, nome: "Carol", email: "carol@example.com", tipo: "Advogado", situacao: "Bloquedo" },
        { id: 30, nome: "Daniel", email: "daniel@example.com", tipo: "Advogado", situacao: "Ativo" },
        { id: 31, nome: "Andrew Marques Silva", email: "andrewmarques2018@gmail.com", tipo: "Administrador", situacao: "Ativo" }
    ];

    const totalUsers = users.length;
    const totalClients = users.filter(user => user.tipo === 'Cliente').length;
    const totalLawyers = users.filter(user => user.tipo === 'Advogado').length;

    const handleEdit = (userId) => {
        setFormUser(users.find(user => user.id === userId))
    };

    function handleInputChange() {

    }

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
                                <div className={`user-row ${user.situacao === 'Ativo' ? 'active' : 'inactive'}`} key={user.id} onClick={() => handleEdit(user.id)}>
                                    <p>{user.nome}</p>
                                    <p>{user.email}</p>
                                    <p>{user.tipo}</p>
                                    <p>{user.situacao}</p>
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

            {formUser && (
                <div className='drawer-user-managment'>
                    <form>
                        <label>
                            Nome:
                            <input
                                type='text'
                                id='nome'
                                value={formUser.nome || ''}
                                onChange={handleInputChange}
                            />
                        </label>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ManegeUsers;