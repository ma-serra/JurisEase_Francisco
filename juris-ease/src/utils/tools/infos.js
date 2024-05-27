export function generateInfoKeysHtml() {
    return `
            <style>
                .section {
                    margin-bottom: 20px;
                }
                .section h2 {
                    margin-bottom: 10px;
                    font-size: 12pt;
                }
                .section p {
                    margin: 5px 0;
                    font-size: 10pt
                }
            </style>
            <div class="section">
                <h2>Data do Sistema:</h2>
                <p>Data Atual: {{data_atual}}</p>
                <p>Data Atual por Extenso: {{data_atual_extenso}}</p>
                <p>Ano: {{data_atual.ano_extenso}}</p>
                <p>Mês: {{data_atual.mes}}</p>
                <p>Mês por Extenso: {{data_atual.mes_extenso}}</p>
                <p>Dia: {{data_atual.dia}}</p>
                <p>Dia por Extenso: {{data_atual.dia_extenso}}</p>
            </div>

            <div class="section">
                <h2>Informações do Usuário:</h2>
                <p>Nome: {{nome_usuario}}</p>
                <p>Telefone: {{telefone_usuario}}</p>
                <p>Email: {{email_usuario}}</p>
                <p>Tipo de Usuário: {{tipo_usuario}}</p>
                <p>OAB: {{oab_usuario}}</p>
                <p>Cep: {{cep_usuario}}</p>
                <p>Estado: {{estado_usuario}}</p>
                <p>Cidade: {{cidade_usuario}}</p>
                <p>Logradouro: {{logradouro_usuario}}</p>
                <p>Número: {{numero_casa_usuario}}</p>
                <p>Endereço: {{endereco_usuario}}</p>
            </div>

            <div class="section">
                <h2>Stage 01:</h2>
                <p>Nome do Autor: {{nome_autor}}</p>
                <p>Nacionalidade: {{nacionalidade}}</p>
                <p>Estado Civil: {{estado_civil}}</p>
                <p>Profissão: {{profissao}}</p>
                <p>CPF: {{numero_CPF}}</p>
                <p>RG: {{numero_RG}}</p>
                <p>Órgão Expedidor/UF: {{orgao_expedidor_UF}}</p>
                <p>Telefone: {{telefone}}</p>
                <p>Endereço: {{endereco}}</p>
            </div>

            <div class="section">
                <h2>Stage 02:</h2>
                <p>OBS: Troque o "numero" por o numero correspondente a reclamada</p>
                <p>Exemplo: {{reclamada.1.nome}}</p>
                <br />
                <div>
                    <p>Reclamada Nome: {{reclamada.numero.nome}}</p>
                    <p>Tipo de Responsabilidade: {{reclamada.numero.tipo_responsabilidade}}</p>
                    <p>CPF/CNPJ: {{reclamada.numero.num_cpf_cnpj}}</p>
                    <p>Endereço: {{reclamada.numero.endereco}}</p>
                </div>
            </div>

            <div class="section">
                <h2>Stage 03:</h2>
                <p>Data de Admissão: {{data_admisao}}</p>
                <p>Data de Rescisão: {{data_rescisao}}</p>
                <p>Tipo de Rescisão: {{tipo_rescisao}}</p>
                <p>Cargo: {{cargo}}</p>
                <p>Remuneração: {{remuneracao}}</p>
            </div>

            <div class="section">
                <h2>Stage 04:</h2>
                <p>Cidade/UF Vara do Trabalho: {{cidade_uf_vara_trabalho}}</p>
            </div>
    `;
}