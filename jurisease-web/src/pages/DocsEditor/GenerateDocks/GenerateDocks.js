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
                    <div className='sheet-content'>
                        <div className="document-content">
                            {/* Conteúdo da folha */}
                            <h1>Título do Documento</h1>
                            <p>Este é um parágrafo de exemplo dentro da folha.</p>
                            <p>Outro parágrafo para ilustrar.</p>
                            <ul>
                                <li>Item 1</li>
                                <li>Item 2</li>
                                <li>Item 3</li>
                            </ul>
                        </div>
                    </div>

                </div>

                {/* Drawer na direita para configurações */}
                <div className="right-drawer">

                    {/* Conteúdo do drawer de configurações */}
                </div>
            </div>

            {/* Drawer inferior para progresso e navegação */}
            <div className="bottom-drawer">
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
