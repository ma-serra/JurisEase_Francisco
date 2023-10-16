import React from 'react';

function Footer({ orientation }) {
    return (
        <footer className={`footer ${orientation}`}>
            <div className="footer-content">
                <p>Contato: exemplo@email.com | Telefone: (123) 456-7890</p>
                <p>&copy; 2023 Juris Ease. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;