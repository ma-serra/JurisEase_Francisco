function sum(a, b) {
    console.log(`Somando: ${a} + ${b}`)
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
    const result = numA + numB;

    // Retorna o resultado formatado conforme a entrada
    return isMonetaryA || isMonetaryB ? 'R$ ' + result.toFixed(2) : result;
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
        execute: (params) => params.reduce((acc, val) => sum(acc + val), 0),
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
