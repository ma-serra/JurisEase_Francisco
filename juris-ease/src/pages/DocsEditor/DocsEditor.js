import './DocsEditor.css'
import Header from "../../components/Header/Header";
import { useEffect, useState } from 'react';
import { getUser } from '../../utils/data_base/firebase/dao/userDAO';
import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication';
import { useNavigate } from 'react-router-dom';


function DocsEditor() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const navigateTo = (link) => {
    navigate(`/${link}`);
  };

  useEffect(() => {
    async function fetchUser() {
      const isAuthenticated = isUserAuthenticated();

      if (isAuthenticated) {
        const userData = await getUser(isAuthenticated);
        setUser(userData);
      }
    }

    fetchUser(); // Chame a função de busca de usuário aqui
  }, [])

  return (
    <div className={`DocsEditor`}>
      <Header user={user} />

      <h1 className='dock-edit-title'>Edição de Documentos</h1>

      <div className='dock-edit-actions'>
        <div className='generate-docks' onClick={() => { navigateTo('generate-docks')}}>
          <p className='action-title'>Gerar Documentos</p>
        </div>

        <div className='management-templates' onClick={() => { navigateTo('templates')}}>
          <p className='action-title'>Gerenciar Templates</p>
        </div>
      </div>
    </div>
  );
}

export default DocsEditor;
