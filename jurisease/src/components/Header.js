import React from 'react';

function Header() {
    return (
        <header className="header">
            <div className="header-content-left">
                <div >
                    <img className="logo" src="/logo.png" alt="Logo do Meu Site" />
                </div>
                <div >
                    <h1>Juris Ease</h1>
                </div>
            </div>
            <div className="header-content-right">
                <div className="header-right-element">
                    <p>Serviços</p>
                </div>
                <div className="header-right-element">
                    <p>Fale conosco</p>
                </div>
            </div>
        </header>
    );
}

export default Header;