import React from 'react';

function LawyerSection({ orientation, device }) {
    return (
        <section className={`lawyer-section ${orientation} ${device}`}>
            <div className={`lawyer-info`}>
                <h1>Potencialize a produtividade do seu setor jurídico.</h1>
                <h2>Promova decisões embasadas em informações jurídicas confiáveis para garantir assertividade.</h2>
                <br></br>
                <img className="imagem_principal" src="/imagem1.jpg" alt="Logo do Meu Site" />
            </div>
        </section>
    );
}

export default LawyerSection;