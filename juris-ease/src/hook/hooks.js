import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function useReloadListener() {
    const navigate = useNavigate();

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            console.log("Redirecionando para a página inicial");
            // Empurrar uma nova entrada no histórico do navegador
            window.history.pushState({}, '');
            // Redirecionar para a página inicial
            navigate('/');
            // Impedir o recarregamento da página
            event.preventDefault();
            event.returnValue = ''; // Necessário para alguns navegadores
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Remover o botão de recarregar
        window.addEventListener('DOMContentLoaded', () => {
            const reloadButton = document.querySelector('[data-testid="reloadButton"]');
            if (reloadButton) {
                reloadButton.style.display = 'none';
            }
        });

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [navigate]);
}
