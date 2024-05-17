/**
* TODO: Necessidade de criar chave (variável) para cidade e uf da vara do trabalho (talvez fique melhor deixar fixa na etapa 4)
* ? Etapa 4 são dados automáticos dos templates base, escolha outra etapa, melhor
* TODO: Formatação do texto precisa ser corrigida (1. não tem como colocar o espaço do início de parágrafo, 2. não dá pra centralizar ou justificar o texto, 3. não dá pra recuar o parágrafo inteiro numa citação ou transcrição)
* ! Necessário criar o próprio componente de edição de texto para esse fim
* ! Implementar centralizar e justificar texto para padrão
* TODO: Criar variável "data" (com nome do mês por extenso) para colocar no final da petição (se possível, que "puxe" a data automaticamente do sistema ou do computador)
* * Variáveis criadas: {{data_atual}}, {{data_atual_estenso}}, {{data_atual.ano_extenso}}, {{data_atual.mes}}, {{data_atual.mes_extenso}}, {{data_atual.dia}}, {{data_atual.dia_extenso}}
* TODO: Veja se dá para o programa ir salvando automaticamente os templates que estamos criando (passei um tempão produzindo um template específico e apertei no botão de menos de uma chave criada e saiu do ar. Quando voltou tinha perdido tudo)
* * Resolvido com refatoração do template
* TODO: Criar o tipo "horário" para as chaves (quando criar, fazer as funções adição e subtração calcular o resultado em minutos)
* * Criei as funções que retornam em valores do tipo horario (ex: 14:45)
* TODO: No tipo "função", possibilitar a inclusão de mais fatores (só tem o fator1 e o fator2) e deixar a escolha do tipo de operação entre os fatores (exemplo: fator1 operação fator2 operação fator3)
* * Implementado na tela templates
* TODO: Caso não seja possível o item anterior, possibilitar a inclusão de mais fatores ao menos na operação soma, pois é necessário somar todos os valores de uma inicial.
* * Implementado
* TODO: Faltou me mandar a chave do cargo
* * Implementado
* TODO: Na geração de documentos, depois que preenchi os dados da reclamada e passei para a etapa seguinte, apareceram os dados que preenchi (menos os dados da reclamada) e apareceram campos extras para eu preencher (dados da reclamada.1, remuneração[novamente], datas de admissão e rescisão [novamente] e os campos de fatos, fundamentos e pedidos [estes últimos, eu deixei em branco])
* * Implementado {{reclamada.n.nome}}, {{reclamada.n.tipo_responsabilidade}}, {{reclamada.n.num_cpf_cnpj}}, {{reclamada.n.endereco}}
* TODO: No preview e nos documentos gerados, as datas aparecem invertidas (ano/mês/dia)
* * Corrigido
* TODO: Função subtração de datas não está calculando corretamente (quando corrigir, colocar o resultado em número de dias)
* * Implementada nova função: Diferença entre datas
* TODO: Na geração de documentos, os campos definidos como funções estão aparecendo para o usuário (aparece com o resultado 0), mas não deveriam aparecer, já que deveriam apenas calcular.
* * Funcionamento padrão para testes
* TODO: Vários campos definidos como funções não realizaram o cálculo. Observei que as caixas "operação" estão apagando as opções que escolhemos.
* * Corrigido
* TODO: Na geração do documento em word, as palavras acentuadas estão saindo com erros
* ! Falta corrigir
* TODO: Na geração do documento em PDF, as palavras estão sendo cortadas na divisão de páginas
* ! Falta corrigir
* TODO: Após chegar à última etapa da geração, quando uso o botão voltar, as caixas Doc Format e PDF Format continuam na tela
* * Corrigido
* TODO: Após chegar à última etapa da geração, quando uso o botão voltar, os templates específicos desaparecem do principal, tendo que ser inserido novamente. Porém, os dados que haviam sido preenchidos, permaneceram nos campos do template específico.
* * Corrigido
* TODO: Botão iniciar novo documento ainda sem funcionar
* * Implementado
* TODO: Quando estou nas etapas da geração de documentos, não consigo clicar no nome do usuário para utilizar as opções. Preciso clicar em jurisease, o que faz voltar para a tela principal, reabilitando as opções do usuário
* * Implementado
* TODO: Quando usei um campo do template principal (remuneração) no template específico, não puxou a informação.
* ? Falta analisar
* TODO: Quando criei uma chave sem usar o auto generate, não funcionou (não apareceu o campo para eu prencher quando adicionei o emplate específico no principal)
* * Corrigido
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
{{endereco_usuario}}
{{tipo_usuario}}

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
{{renuneracao}}


Melhorias:
Geral:
1. Testes Unitários

Template:
1. Adicionar ordenação: Permitir que os usuários ordenem os templates por diferentes critérios, como título, data de criação, etc., pode tornar a navegação mais conveniente.
2. Melhorar a validação de acesso: Além de verificar se o usuário tem permissão para acessar a página, você também pode considerar outras formas de proteger o acesso aos templates, como autenticação de dois fatores ou restrições baseadas em função.
3. Adicionar feedback de carregamento: Se houver uma carga significativa de dados ao buscar ou carregar os templates, considere adicionar indicadores visuais para informar aos usuários que a operação está em andamento.

