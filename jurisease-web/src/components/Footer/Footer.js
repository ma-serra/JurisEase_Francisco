import './Footer.css'
import React from 'react';

function Footer() {
    return (
        <footer className={`Footer`}>
            <div>
                <p>Contato: exemplo@email.com | Telefone: (123) 456-7890</p>
                <p>&copy; 2023 Juris Ease. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}

export default Footer;