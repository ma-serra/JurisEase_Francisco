import React from 'react';

function ManchetesSection({ orientation }) {
    return (
        <div className={`manchetes-content ${orientation}`}>
            <h1>Os temas mais atuais estão aqui</h1>
            
            <div>
            <a target="_blank" rel="noreferrer" href="https://www.jornaljurid.com.br/noticias/incidencia-de-iss-sobre-preco-total-de-diarias-de-hotel-e-constitucional-decide-stf">
            <div className={`card`}>
                <img src="/service_exemplo.png" alt="Imagem do Serviço" />
                <div>
                    <h2>Incidência de ISS sobre preço total de diárias de hotel é constitucional, decide STF</h2>
                    <p>Para o Plenário, a atividade de hospedagem é preponderantemente de prestação de serviço.</p>
                </div>
            </div>
            </a>
            </div>

            <div>
            <a target="_blank" rel="noreferrer" href="https://www.jornaljurid.com.br/noticias/revisao-do-fgts-retomada-do-julgamento-e-oportunidade-para-advogados-no-atendimento-aos-clientes">
            <div className={`card`}>
                <img src="/service_exemplo.png" alt="Imagem do Serviço" />
                <div>
                    <h2>Revisão do FGTS: retomada do julgamento é oportunidade para advogados no atendimento aos clientes</h2>
                    <p>Operadores do Direito acompanham de perto a análise sobre a correção do benefício, que ocorrerá no STF na próxima quarta-feira (18).</p>
                </div>
            </div>
            </a>
            </div>

            <div>
            <a target="_blank" rel="noreferrer" href="https://www.jornaljurid.com.br/noticias/stj-determina-nova-pericia-de-paternidade-a-partir-de-parentes-consanguineos">
            <div className={`card`}>
                <img src="/service_exemplo.png" alt="Imagem do Serviço" />
                <div>
                    <h2>STJ determina nova perícia de paternidade a partir de parentes consanguíneos</h2>
                    <p>Segundo a advogada Rafaella Gentil Gevaerd, é possível reverter a sentença a partir da determinação de DNA mesmo após a morte do suposto pai.</p>
                </div>
            </div>
            </a>
            </div>

        </div>
    );
}

export default ManchetesSection;