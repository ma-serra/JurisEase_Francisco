export function validateFormTemplate(form, type) {
    const erros = {}
    // Validar se o título está presente
    if (!form.title) {
        erros.title = 'Por favor, forneça um título para o template.'
    }

    // Validar se há pelo menos um caminho e nenhum caminho vazio
    if (type === 'specific' && (!form.rout || form.rout.length === 0 || form.rout.some(path => !path.trim()))) {
        erros.rout = 'Por favor, adicione um caminho válido.'
    }

    // Validar se há pelo menos uma chave do documento e nenhuma chave vazia
    if (
        form.keys &&
        form.keys.length > 0 &&
        form.keys.some(keys => !keys.id?.trim())
    ) {
        erros.keys = 'Por favor, preencha todas as chaves do documento.'
    }

    const contents = form.contents
    if (type === 'base' && (!contents.base)) {
        erros.contents = 'Por favor, adicione conteúdo no na caixa de texto do corpo do template'
    } else if (type === 'specific' && (!contents.fatos && !contents.fundamentos && !contents.pedidos)) {
        erros.contents = 'Por favor, adicione conteúdo em pelo menos uma caixa de texto'
    }

    if (type === 'base' && (!form.typeTermination)) {
        erros.typeTermination = 'Por favor, preencha o tipo de rescisão'
    }

    if (type === 'base' && (!form.numberOfComplaints)) {
        erros.numberOfComplaints = 'Por favor, informe o número de reclamadas'
    }

    if (type === 'base' && form.numberOfComplaints <= 0) {
        erros.numberOfComplaints = 'O número de reclamadas é inválido!'
    }

    if (type === 'base' && form.typesResponsibilities.filter(type => type === '').length > 0) {
        erros.typesResponsibilities = 'Por favor, preencha os tipos de responsabilidades para cada uma das reclamadas.'
    }

    return erros
}