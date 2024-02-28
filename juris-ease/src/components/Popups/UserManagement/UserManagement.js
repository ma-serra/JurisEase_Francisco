import './UserManagement.css';
import React, { useState } from 'react';
import { validarOAB } from '../../../utils/tools/tools'
import { updateUser } from '../../../utils/data_base/firebase/dao/userDAO'
import { recoverPassword, logout, verifyPassword } from '../../../utils/data_base/firebase/authentication'

function UserManagement({ device, close, user }) {

    const initialFormData = {
        name: user.name,
        email: user.email,
        password: '',
        oab: user.oab,
        acessAdmin: user.acessAdmin,
        phoneNumber: user.phoneNumber,
        type: user.type,
        address: user.address ? { ...user.address } : {
            cep: '',
            estado: '',
            cidade: '',
            rua: '',
            numero: ''
        }
    };

    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressProperty = name.split('.')[1];
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [addressProperty]: value
                }
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({ ...formData, [name]: checked });
      };

    const clearForm = () => {
        setFormData(initialFormData);
    };

    const closePage = () => {
        close();
    };

    function toggleAddressSubfields() {
        const addressSubfields = document.getElementById('toggleAddress');
        if (addressSubfields.style.display === 'none' || addressSubfields.style.display === '') {
            addressSubfields.style.display = 'flex'
        } else {
            addressSubfields.style.display = 'none';
        }
    }

    async function applyChanges() {
        try {

            if (!formData.password) {
                throw new Error('Preencha o campo password para aplicar mudanças!')
            } else {
                const validatePass = await verifyPassword(user.email, formData.password)
                if (!validatePass) {
                    throw new Error('Password inválido!')
                }
            }

            if (!formData.name || !formData.email || !formData.type) {
                // sempre está caindo aqui, mesmo com os campos preenchidos!
                throw new Error('Os campos nome e email são obrigatórios!')
            }

            if (formData.type === 'lawyer') {
                const validateOAB = validarOAB(formData.oab)
                if (!validateOAB) {
                    throw new Error('Número da OAB inválido!')
                }
            }

            const newUser = updateUserWithFormData(user, formData)
            updateUser(newUser)
            setError(null)
            window.location.reload();

        } catch (e) {
            setError(e.message)
        }
    }

    function cancelChanges() {
        closePage()
    }

    function updateUserWithFormData(user, formData) {
        const updatedUser = { ...user };

        updatedUser.name = formData.name;
        updatedUser.email = formData.email;
        updatedUser.oab = formData.oab;
        updatedUser.acessAdmin = formData.acessAdmin;
        updatedUser.phoneNumber = formData.phoneNumber;
        updatedUser.type = formData.type;
        updatedUser.address = formData.address;

        return updatedUser;
    }

    async function forgotPassword() {
        const email = user.email
        try {
          await recoverPassword(email);
          logout();
          setTimeout(() => window.location.reload(), 3000);

        } catch (error) {
          console.log(error.message);
        }
    }

    return (
        <div className={`content-user-page ${device}`} onClick={(closePage)}>
            <div className="user-page" onClick={(e) => e.stopPropagation()}>
                <h1>Gerenciar Conta</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="name">Nome</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">Telefone</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group address">
                        <label htmlFor="toggleAddress" className="address-title" onClick={toggleAddressSubfields}>
                            Endereço
                            <img className='arrow-down' src='/images/icons8-arrow-down-30.png' alt='arrow-down'></img>
                        </label>

                        <div id="toggleAddress" className="address-subfields">
                            <div className="subfield">
                                <label htmlFor="cep">CEP</label>
                                <input
                                    type="text"
                                    id="cep"
                                    name="address.cep"
                                    value={formData.address.cep}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="subfield">
                                <label htmlFor="estado">Estado</label>
                                <input
                                    type="text"
                                    id="estado"
                                    name="address.estado"
                                    value={formData.address.estado}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="subfield">
                                <label htmlFor="cidade">Cidade</label>
                                <input
                                    type="text"
                                    id="cidade"
                                    name="address.cidade"
                                    value={formData.address.cidade}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="subfield">
                                <label htmlFor="address.rua">Rua</label>
                                <input
                                    type="text"
                                    id="rua"
                                    name="address.rua"
                                    value={formData.address.rua}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="subfield">
                                <label htmlFor="numero">Número</label>
                                <input
                                    type="text"
                                    id="numero"
                                    name="address.numero"
                                    value={formData.address.numero}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Tipo de Usuário</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                        >
                            <option value="client">Cliente</option>
                            <option value="lawyer">Advogado</option>
                        </select>
                    </div>

                    {formData.type === 'lawyer' && (
                        <div className="form-group">
                            <label htmlFor="oab">Número da OAB</label>
                            <input
                                type="text"
                                id="oab"
                                name="oab"
                                value={formData.oab}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="acessAdmin">Acesso de Administrador</label>
                        <input
                            type="checkbox"
                            id="acessAdmin"
                            name="acessAdmin"
                            checked={formData.acessAdmin}
                            onChange={handleCheckboxChange}
                        />
                    </div>
                </form>
                <p className='forgot-password' onClick={forgotPassword}>Esqueceu sua senha? Clique aqui!</p>
                {error && <p className="msg-error">{error}</p>}
                <div className='bts-options'>
                    <button onClick={cancelChanges}>Cancelar</button>
                    <button onClick={applyChanges}>Aplicar</button>
                </div>

            </div>
        </div>
    );
}

export default UserManagement;
