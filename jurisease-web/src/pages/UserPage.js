import './AuthPage.css';
import React, { useState } from 'react';

function UserPage({ device, close, user }) {

    const initialFormData = {
        name: user.name,
        email: user.email,
        password: '',
        oab: user.oab,
        acessAdmin: user.acessAdmin,
        phoneNumber: user.phoneNumber,
        type: user.type,
        adress: user.adress,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

    function applyChanges() {
        setError('Error .... Ainda não implementado!')
    }

    function cancelChanges() {
        closePage()
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

                    <div className="form-group adress">
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
                                    name="cep"
                                    value={formData.cep}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="subfield">
                                <label htmlFor="estado">Estado</label>
                                <input
                                    type="text"
                                    id="estado"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="subfield">
                                <label htmlFor="cidade">Cidade</label>
                                <input
                                    type="text"
                                    id="cidade"
                                    name="cidade"
                                    value={formData.cidade}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="subfield">
                                <label htmlFor="rua">Rua</label>
                                <input
                                    type="text"
                                    id="rua"
                                    name="rua"
                                    value={formData.rua}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="subfield">
                                <label htmlFor="num">Número</label>
                                <input
                                    type="text"
                                    id="num"
                                    name="num"
                                    value={formData.num}
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
                            onChange={handleInputChange}
                        />
                    </div>
                </form>
                <p className='forgot-password'>Esqueceu sua senha? Clique aqui!</p>
                {error && <p className="msg-error">{error}</p>}
                <div className='bts-options'>
                    <button onClick={cancelChanges}>Cancelar</button>
                    <button onClick={applyChanges}>Aplicar</button>
                </div>
                
            </div>
        </div>
    );
}

export default UserPage;
