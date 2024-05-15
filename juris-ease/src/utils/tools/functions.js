// TODO: Função para determinar o tipo de um parametro
const isMonetary = (value) => typeof value === 'string' && value.trim().startsWith('R$');
const isHour = (value) => typeof value === 'string' && /^\d{1,2}:\d{2}$/.test(value);
const isNumber = (value) => typeof value === 'string' && !isNaN(value) && !value.includes(':');

function determineType(element) {
    if (isMonetary(element)) {
        return 'monetary';

    } else if (isHour(element)) {
        return 'hour';

    } else if (isNumber(element)) {
        return 'number';

    } else {
        return 'invalid';
    }
}

// TODO: Função para determinar se todos os parametros são iguais
function allSameType(elements) {
    if (elements.length === 0) return 'empty';

    const firstType = determineType(elements[0]);
    if (firstType === 'invalid') return false;

    for (let element of elements) {
        if (determineType(element) !== firstType) {
            return false;
        }
    }
    return firstType;
}

function sum(elements) {
    const type = allSameType(elements);
    console.log(type)
    if (type === 'error' || type === 'empty') {
        throw new Error("Elements are not of the same type or list is empty");
    }

    switch (type) {
        case 'number':
            return sumNumbers(elements);
        case 'monetary':
            return sumMonetary(elements);
        case 'hour':
            return sumHours(elements);
        default:
            throw new Error("Unsupported element type");
    }
}

function sumNumbers(elements) {
    return elements.reduce((acc, val) => acc + parseFloat(val), 0);
}

function sumMonetary(elements) {
    const normalizeMonetary = (value) => parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
    const sum = elements.reduce((acc, val) => acc + normalizeMonetary(val), 0);
    return 'R$ ' + sum.toFixed(2).replace('.', ',');
}

function sumHours(elements) {
    const parseHours = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const formatHours = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const totalMinutes = elements.reduce((acc, val) => acc + parseHours(val), 0);
    return formatHours(totalMinutes);
}

// Função para subtração
function subtract(a, b) {
    // Verifica se a entrada é monetária (começa com 'R$')
    const isMonetaryA = typeof a === 'string' && a.trim().startsWith('R$');
    const isMonetaryB = typeof b === 'string' && b.trim().startsWith('R$');

    // Remove o símbolo de moeda 'R$' e quaisquer caracteres de formatação (como espaços) e substitui a vírgula por ponto, se for monetário
    const normalize = (value) => {
        if (typeof value === 'string' && value.trim().startsWith('R$')) {
            return parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'));
        }
        return parseFloat(value);
    };

    const numA = normalize(a);
    const numB = normalize(b);

    // Verifica se algum dos valores é um NaN após a conversão
    if (isNaN(numA) || isNaN(numB)) {
        throw new Error("A adição não é suportada para valores não numéricos.");
    }

    // Realiza a adição
    const result = numA - numB;

    // Retorna o resultado formatado conforme a entrada
    return isMonetaryA || isMonetaryB ? 'R$ ' + result.toFixed(2) : result;
}

// Função para converter valores monetários para números
function parseCurrency(value) {
    return parseFloat(value.replace(/[^\d.,-]/g, '').replace(',', '.'));
}

// Função para multiplicação
function multiplication(a, b) {
    // Verifica se os valores são do tipo Date
    if (a instanceof Date || b instanceof Date) {
        throw new Error("Multiplicação não aceita valores do tipo Date.");
    }

    // Se a for monetário, converte para número antes de multiplicar
    if (typeof a === 'string' && a.startsWith("R$")) {
        a = parseCurrency(a);
    }
    // Se b for monetário, converte para número antes de multiplicar
    if (typeof b === 'string' && b.startsWith("R$")) {
        b = parseCurrency(b);
    }

    // Realiza a multiplicação
    const result = a * b
    return result || '0';
}

// Função para divisão
function division(a, b) {
    // Verifica se os valores são do tipo Date
    if (a instanceof Date || b instanceof Date) {
        throw new Error("Divisão não aceita valores do tipo Date.");
    }

    // Realiza a divisão
    if (typeof a === 'string') {
        a = parseCurrency(a);
    }
    if (typeof b === 'string') {
        b = parseCurrency(b);
    }

    // Verifica se os valores são números
    if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
        throw new Error("Divisão aceita somente valores numéricos.");
    }

    if (b !== 0) {
        const result = a / b
        return result || '0';
    } else {
        return 'impossível'
    }
}

export const functions = {
    sum: {
        name: "Soma",
        manyParams: true,
        minParams: 2,
        typesPermitted: ["monetary", "number", "hours"],
        execute: (params) => sum(params),
    },
    subtract: {
        name: "Subtração",
        manyParams: true,
        minParams: 2,
        typesPermitted: ["monetary", "number", "date", "hours"],
        execute: (params) => params.reduce((acc, val) => subtract(acc + val), 0),
    },
    division: {
        name: "Divisão",
        manyParams: true,
        minParams: 2,
        typesPermitted: ["monetary", "number", "hours"],
        execute: (params) => params.reduce((acc, val) => division(acc + val), 0),
    },
    multiplication: {
        name: "Multiplicação",
        manyParams: true,
        minParams: 2,
        typesPermitted: ["monetary", "number", "hours"],
        execute: (params) => params.reduce((acc, val) => multiplication(acc + val), 0),
    },
}
