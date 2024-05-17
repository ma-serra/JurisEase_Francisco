
// Função para formatar o valor monetário, se necessário
export const formatMonetary = (value) => {
    if (value && !/^R\$ \d+(\,\d{2})?$/.test(value)) {
        // Remove todos os caracteres que não são dígitos ou vírgulas e converte para float
        const numberValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
        if (!isNaN(numberValue)) {
            return `R$ ${numberValue.toFixed(2).replace('.', ',')}`;
        }
    }
    return value || '';
};

// Função para formatar o valor hour, se necessário
export const formatHour = (value) => {

    // até 2 dígitos transforma em horas
    if (value.length < 3 && /^\d+$/.test(value)) {
        return `${value}:00`
    }

    // verifica se tem somente números ou dígitos seguidos por um caractere de dois-pontos e mais dígitos
    if (!/^\d+(?::\d+)?$/.test(value)) {
        return ''
    }

    // verifica se há 2 digitos após caracter ':'
    if (value.includes(':') && !/\d{2}$/.test(value.split(':')[1])) {
        return ''
    }

    let minutes = value.substring(value.length - 2, value.length)
    let extraHours = 0
    minutes = parseInt(minutes)

    // Se os minutos forem maiores que 60, converter em horas e ajustar os minutos restantes
    if (minutes >= 60) {
        extraHours = Math.floor(minutes / 60);
        minutes %= 60; // Ajustar os minutos restantes
    }

    // Extrair as horas (todos os outros números)
    let hours = parseInt(value.replace(/\D/g, '').slice(0, -2), 10) + extraHours;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const formatDate = (value) => {
    // Criando um objeto Date usando as partes da data (ano, mês, dia)
    const parts = value.split('-');
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    
    // Obtendo o dia
    const day = date.getDate();
    
    // Obtendo o mês (adicionando 1, pois em JavaScript os meses são indexados de 0 a 11)
    const month = date.getMonth() + 1;
    
    // Obtendo o ano
    const year = date.getFullYear();

    // Formatando a data no formato brasileiro (dd/mm/aaaa)
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
};
