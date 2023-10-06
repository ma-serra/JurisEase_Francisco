import React from 'react';

function LawyerSection() {
    return (
        <section className="lawyer-section">
            <div className="lawyer-info">
                <h2>Potencialize a produtividade do seu setor jurídico.</h2>
                <p><b>Promova decisões embasadas em informações jurídicas confiáveis para garantir assertividade.</b></p>
                <br></br>
                <img className="logo" src="/imagem1.jpg" alt="Logo do Meu Site" />
            </div>
            <div className="lawyer-self">
                <p className='nome'>Fulano de Talls Pereira</p>
                <img className="logo" src="/img-perfil.jpg" alt="Logo do Meu Site" />
                <p className='sobre'>Advogado experiente em direito civil e empresarial, focado em soluções eficazes para empresas e indivíduos."</p>
            </div>
        </section>
    );
}

export default LawyerSection;