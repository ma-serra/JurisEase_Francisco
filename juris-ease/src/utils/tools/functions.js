// Função para adição
function sum(a, b) {
    // Verifica se os valores são do mesmo tipo ou se são do tipo Date
    if ((a instanceof Date && !(b instanceof Date)) || (!(a instanceof Date) && b instanceof Date)) {
        throw new Error("Adição aceita somente valores do mesmo tipo ou valores do tipo Date.");
    }

    // Converte os valores para números caso sejam do tipo Date
    a = (a instanceof Date) ? a.getTime() : a;
    b = (b instanceof Date) ? b.getTime() : b;

    // Realiza a adição
    return a + b;
}

// Função para subtração
function subtract(a, b) {
    // Verifica se os valores são do mesmo tipo ou se são do tipo Date
    if ((a instanceof Date && !(b instanceof Date)) || (!(a instanceof Date) && b instanceof Date)) {
        throw new Error("Subtração aceita somente valores do mesmo tipo ou valores do tipo Date.");
    }

    // Converte os valores para números caso sejam do tipo Date
    a = (a instanceof Date) ? a.getTime() : a;
    b = (b instanceof Date) ? b.getTime() : b;

    // Realiza a subtração
    return a - b;
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
    return a * b;
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
        return a / b;
    } else {
        throw new Error("Não é possível dividir por zero!");
    }
}

export const functions = {
    sum: {
        name: "Soma",
        params: [
            { name: "fator1", type: ["monetary", "date", "number"] },
            { name: "fator2", type: ["monetary", "date", "number"] },
        ],
        execute: (a, b) => sum(a, b)
    },
    subtract: {
        name: "Subtração",
        params: [
            { name: "fator1", type: ["monetary", "date", "number"] },
            { name: "fator2", type: ["monetary", "date", "number"] },
        ],
        execute: (a, b) => subtract(a, b)
    },
    division: {
        name: "Divisão",
        params: [
            { name: "fator1", type: ["monetary", "number"] },
            { name: "fator2", type: ["number"] },
        ],
        execute: (a, b) => division(a, b)
    },
    multiplication: {
        name: "Multiplicação",
        params: [
            { name: "fator1", type: ["monetary", "number"] },
            { name: "fator2", type: ["number"] },
        ],
        execute: (a, b) => multiplication(a, b)
    },
}
