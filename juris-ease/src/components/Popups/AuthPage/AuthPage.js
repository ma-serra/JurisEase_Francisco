import './AuthPage.css';
import React, { useState } from 'react';

import { signIn, register, recoverPassword } from '../../../utils/data_base/firebase/authentication';
import { addUser } from '../../../utils/data_base/firebase/dao/userDAO'
import { validarOAB } from '../../../utils/tools/tools'

function AuthPage({ device, toogleAuth, auth }) {
  const initialFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    oab: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (formData.email && formData.password) {
      const data = await signIn(formData.email, formData.password);

      if (data.error) {
        setError(data.error)

      } else {
        console.log(data.user)
        setError(null)
        closeAuth()
        window.location.reload();
      }

    } else {
      setError('Preencha todos os campos e insira um email válido.');
    }
  };

  const handleSignup = async () => {
    if (formData.name && formData.email && formData.password && formData.confirmPassword) {
      if (formData.password === formData.confirmPassword) {

        if (auth !== 'client') {
          const oabValidationResult = validarOAB(formData.oab);
          if (!oabValidationResult) {
            setError('O número da OAB não é inválido.');
            return;
          }
        }

        const data = await register(formData.email, formData.password);
        if (data.error) {
          setError(data.error)

        } else {
          data.user.name = formData.name;
          data.user.type = auth;
          data.user.oab = formData.oab;
          data.user.permissions.acessAdmin = false;

          addUser(data.user)
          setError(null)
          closeAuth()
          window.location.reload();
        }

      } else {
        setError('A senha e a confirmação de senha não coincidem.');
      }

    } else {
      setError('Preencha todos os campos e insira um email válido.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const clearForm = () => {
    setFormData(initialFormData);
  };

  const closeAuth = () => {
    toogleAuth('none');
  };

  async function forgotPassword() {
    const email = formData.email

    if (!email) {
      setError("Informe o e-mail para recuperar sua senha!")
      return
    }

    try {
      await recoverPassword(email);
      setTimeout(() => window.location.reload(), 3000);

    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className={`content-auth ${device}`} onClick={(closeAuth)}>
      <div className="auth-page" onClick={(e) => e.stopPropagation()}>
        <h1>{isLogin ? 'Login' : 'Cadastro'}</h1>
        <form>
          <div className="form-group">
            {!isLogin && (
              <>
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </>
            )}
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
          {!isLogin && auth === 'lawyer' && (
            <>
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
            </>
          )}
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
            {!isLogin && (
              <>
                <label htmlFor="confirmPassword">Confirmar Senha</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </>
            )}
          </div>
          {error && <p className="msg-error">{error}</p>}
          {isLogin ? (
            <button className='btn-login' type="button" onClick={handleLogin}>
              Entrar
            </button>
          ) : (
            <button className='btn-login' type="button" onClick={handleSignup}>
              Cadastrar
            </button>
          )}
        </form>
        {isLogin && (
          <p className='forgot-password' onClick={forgotPassword}>Esqueceu sua senha? Clique aqui!</p>
        )}
        <p>
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              clearForm();
              setError(null)
            }}
            className="toggle-auth-button"
          >
            {isLogin ? 'Cadastre-se' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
