/**
* TODO: Formatação do texto precisa ser corrigida (1. não tem como colocar o espaço do início de parágrafo, 2. não dá pra centralizar ou justificar o texto, 3. não dá pra recuar o parágrafo inteiro numa citação ou transcrição)
* ! Necessário criar o próprio componente de edição de texto para esse fim
* ! Implementar centralizar e justificar texto para padrão
* TODO: Na geração do documento em word, as palavras acentuadas estão saindo com erros
* ! Falta corrigir
* TODO: Na geração do documento em PDF, as palavras estão sendo cortadas na divisão de páginas
* ! Falta corrigir
* TODO: Os campos (data de admissão, data de rescisão e  remuneração) da etapa 3 ainda não estão funcionando, pois, mesmo sendo preenchidos, ainda aparecem na etapa 4 para serem preenchidos (talvez os nomes das chaves que utilizei no template base sejam diferentes dos nomes das chaves da etapa 3, por isso aparecem na etapa 4. Me confirme, por favor, o nome dessas chaves da etapa 3 e veja porque os campos das datas de admissão e rescisão desta etapa não possuem o calendário igual os campos que aparecem na etapa 4).
* * Corrigido 
* TODO: Corrigir, por favor, o nome da chave "data_atual_estenso" para "data_atual_extenso" e retirar o dia da semana dessa chave (hoje pareceu: "sábado, 18 de maio de 2024", mas preciso que apareça só "18 de maio de 2024")
* * Corrigido
* TODO: Criar uma chave para puxar automaticamente a cidade do usuário (no formato Cidade/UF) do mesmo jeito que foi feito para puxar os dados do usuário (nome_usuário, oab_usuario e endereco_usuario). Obs.: se isso der trabalho, deixa para a segunda versão, pois eu não lembro de ter falado pra vc antes.
* ? Falta analisar
* TODO: Alterar os nomes das opções de tipo de rescisão (etapa 3): de "Pedido de demissão" para "a pedido", de "Demissão sem justa causa" para "sem justa causa" e de "Demissão por justa causa" para "por justa causa". Faltou um tipo de rescisão, que não me atentei na primeira varredura, mas eu tinha falado antes (acrescentar o tipo "por término do prazo contratual")
* ? Falta analisar
**/

Variáveis
Data do Sistema:
{{data_atual}}
{{data_atual_estenso}}
{{data_atual.ano_extenso}}
{{data_atual.mes}}
{{data_atual.mes_extenso}}
{{data_atual.dia}}
{{data_atual.dia_extenso}}

Informações do Usuario:
{{nome_usuario}}
{{email_usuario}}
{{oab_usuario}}
{{telefone_usuario}}
{{tipo_usuario}}
{{cep_usuario}}
{{estado_usuario}}
{{cidade_usuario}}
{{logradouro_usuario}}
{{numero_casa_usuario}}
{{endereco_usuario}}

Stage 01:
{{nome_autor}}
{{nacionalidade}}
{{estado_civil}}
{{profissao}}
{{numero_CPF}}
{{numero_RG}}
{{orgao_expedidor_UF}}
{{endereco}}
{{telefone}}

Stage 02:
{{reclamada.n.nome}}
{{reclamada.n.tipo_responsabilidade}}
{{reclamada.n.num_cpf_cnpj}}
{{reclamada.n.endereco}}

Stage 03:
{{data_admisao}}
{{data_rescisao}}
{{tipo_rescisao}}
{{cargo}}
{{remuneracao}}

Stage 04:
{{cidade_uf_vara_trabalho}}

Melhorias:
Geral:
1. Testes Unitários

Template:
1. Adicionar ordenação: Permitir que os usuários ordenem os templates por diferentes critérios, como título, data de criação, etc., pode tornar a navegação mais conveniente.
2. Melhorar a validação de acesso: Além de verificar se o usuário tem permissão para acessar a página, você também pode considerar outras formas de proteger o acesso aos templates, como autenticação de dois fatores ou restrições baseadas em função.
3. Adicionar feedback de carregamento: Se houver uma carga significativa de dados ao buscar ou carregar os templates, considere adicionar indicadores visuais para informar aos usuários que a operação está em andamento.

