// Importe os estilos
import './GenerateDocks.css';

// Importe as bibliotecas necessárias
import Header from "../../../components/Header/Header";
import { useEffect, useState } from 'react';
import { getUser } from '../../../utils/data_base/firebase/dao/userDAO';
import { isUserAuthenticated } from '../../../utils/data_base/firebase/authentication';

// Componente principal
function GenerateDocks() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            const isAuthenticated = isUserAuthenticated();

            if (isAuthenticated) {
                const userData = await getUser(isAuthenticated);
                setUser(userData);
            }
        }

        fetchUser();
    }, []);

    return (
        <div className="GenerateDocks">
            <Header user={user} />

            <div className="main-section">

                {/* Folha à esquerda */}
                <div className="left-panel">
                    <div className="document-content">

                        {/* Conteúdo da folha */}
                        <p>Este é um parágrafo de exemplo dentro da folha.</p>
                    </div>
                </div>

                {/* Drawer na esquerda para configurações */}
                <div className="drawer left-drawer">
        
                    {/* Conteúdo do drawer de configurações */}
                </div>
            </div>

            {/* Drawer inferior para progresso e navegação */}
            <div className="drawer bottom-drawer">
                {/* Seção de progresso */}
                <div className="progress-section">
                    <div className="sections">
                        <div className="section-1"></div>
                        <div className="section-2"></div>
                        <div className="section-3"></div>
                    </div>
                    <p>Seção</p>
                </div>

                {/* Botões de navegação */}
                <div className="navigation-buttons">
                    <button className="btn-avancar">Avançar</button>
                    <button className="btn-voltar">Voltar</button>
                </div>
            </div>
        </div>
    );
}

export default GenerateDocks;
