import React from 'react';

function LawyerSection({ orientation }) {
    return (
        <section className={`lawyer-section ${orientation}`}>
            <div className="lawyer-info">
                <h2>Potencialize a produtividade do seu setor jurídico.</h2>
                <p><b>Promova decisões embasadas em informações jurídicas confiáveis para garantir assertividade.</b></p>
                <br></br>
                <img className="logo" src="/imagem1.jpg" alt="Logo do Meu Site" />
            </div>
        </section>
    );
}

export default LawyerSection;