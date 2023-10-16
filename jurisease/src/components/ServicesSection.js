import React from 'react';

function ServiceSection({ orientation }) {
    return (
        <div className={`services-content ${orientation}`}>
            <h1>Áreas de Serviços</h1>

            <div>
            <a target="_blank" rel="noreferrer" href="https://www2.correios.com.br/sistemas/buscacep/buscaCepEndereco.cfm">
                <div className={`card`}>
                    <img src="/service_exemplo.png" alt="Imagem do Serviço" />
                    <div>
                        <h2>Consulta de CEP</h2>
                        <p>Com nosso serviço de consulta de CEP, você pode inserir o CEP de qualquer lugar do Brasil e, em questão de segundos, receberá informações detalhadas sobre o endereço associado. Descubra o nome da rua, bairro, cidade e estado sem complicações, facilitando o preenchimento de formulários e garantindo a precisão dos seus dados.</p>
                    </div>
                </div>
            </a>
            </div>

            <div>
            <a target="_blank" rel="noreferrer" href="https://www.ceara.gov.br/2022/12/22/sefaz-divulga-tabela-do-ipva-2023/">
                <div className={`card`}>
                    <img src="/service_exemplo.png" alt="Imagem do Serviço" />
                    <div>
                        <h2>Consulta de Tabela de IPVA</h2>
                        <p>Proprietário de veículo? Nosso serviço de consulta de IPVA permite que você insira a placa do seu veículo e saiba imediatamente qual é o valor do seu IPVA com base na tabela atualizada. Mantenha-se informado sobre os valores a serem pagos, evitando surpresas e atrasos.</p>
                    </div>
                </div>
            </a>
            </div>

            <div>
            <a target="_blank" rel="noreferrer" href="https://www.gov.br/receitafederal/pt-br/canais_atendimento/fale-conosco/presencial">
                <div className={`card`}>
                    <img src="/service_exemplo.png" alt="Imagem do Serviço" />
                    <div>
                        <h2>Agendamento de Atendimento em Órgão Público</h2>
                        <p>Não perca mais tempo em filas longas. Com nosso serviço de agendamento de atendimento em órgãos públicos, como postos de saúde, você pode marcar um horário que seja conveniente para você. Isso significa menos tempo de espera e mais comodidade. Agende seu atendimento com antecedência e otimize seu dia.</p>
                    </div>
                </div>
            </a>
            </div>
        </div>
    );
}

export default ServiceSection;