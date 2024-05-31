import './UserManagement.css';
import React, { useState } from 'react';

import { translateName, validarOAB } from '../../../utils/tools/tools'
import { updateUser } from '../../../utils/data_base/firebase/dao/userDAO'
import { recoverPassword, logout, verifyPassword } from '../../../utils/data_base/firebase/authentication'
import AlertDialog from '../AlertDialog/AlertDialog';

function UserManagement({ onClose, user, fetchUser }) {

    const initialFormData = {
        name: user.name,
        email: user.email,
        password: '',
        oab: user.oab,
        phoneNumber: user.phoneNumber,
        type: user.type,
        address: user.address ? { ...user.address } : {
            cep: '',
            state: '',
            city: '',
            street: '',
            number: ''
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

            if (!formData.name || !user.email) {
                throw new Error('Os campos nome e email são obrigatórios!')
            }

            if (user.type === 'lawyer') {
                const validateOAB = validarOAB(formData.oab)
                console.log(validateOAB)
                if (validateOAB !== true) {
                    throw new Error(validateOAB)
                }
            }

            const newUser = updateUserWithFormData(user, formData)
            updateUser(newUser)
            setError(null)
            fetchUser()
            AlertDialog.show("Dados alterados com sucesso!")
            onClose()

        } catch (e) {
            setError(e.message)
        }
    }

    function updateUserWithFormData(user, formData) {
        const updatedUser = { ...user };

        updatedUser.name = formData.name;
        updatedUser.oab = formData.oab;
        updatedUser.phoneNumber = formData.phoneNumber;
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
        <div className={`content-user-page`} onClick={onClose}>
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
                            value={user.email}
                            disabled={true}
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
                        <label className="address-title" onClick={toggleAddressSubfields}>
                            Endereço
                            <img className='arrow-down' src='/images/icons8-arrow-down-30.png' alt='arrow-down'></img>

                            <input
                                type="text"
                                id="toggleAddress"  
                                name="toggleAddress" 
                                style={{ display: 'none' }}
                            />
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
                                <label htmlFor="state">Estado</label>
                                <input
                                    type="text"
                                    id="state"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="subfield">
                                <label htmlFor="city">Cidade</label>
                                <input
                                    type="text"
                                    id="city"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="subfield">
                                <label htmlFor="street">Rua</label>
                                <input
                                    type="text"
                                    id="street"
                                    name="address.street"
                                    value={formData.address.street}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="subfield">
                                <label htmlFor="number">Número</label>
                                <input
                                    type="text"
                                    id="number"
                                    name="address.number"
                                    value={formData.address.number}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Tipo de Usuário</label>
                        <input
                            id="type"
                            name="type"
                            value={translateName(user.type)}
                            disabled={true}
                        >
                        </input>
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
                </form>
                <p className='forgot-password' onClick={forgotPassword}>Esqueceu sua senha? Clique aqui!</p>
                {error && <p className="msg-error">{error}</p>}
                <div className='bts-options'>
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={applyChanges}>Aplicar</button>
                </div>

            </div>
        </div>
    );
}

export default UserManagement;
