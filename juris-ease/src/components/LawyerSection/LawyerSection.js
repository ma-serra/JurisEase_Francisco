import './LawyerSection.css'
import React from 'react';

function LawyerSection({ orientation, device }) {
    return (
        <section>
            <div className={`Lawyer-section`}>
                <h1>Potencialize a produtividade do seu setor jurídico.</h1>
                <h2>Promova decisões embasadas em informações jurídicas confiáveis para garantir assertividade.</h2>
                <br></br>
                <img className="imagem_principal" src="/images/img-lawyer2.jpg" alt="Logo do Meu Site" />
            </div>
        </section>
    );
}

export default LawyerSection;