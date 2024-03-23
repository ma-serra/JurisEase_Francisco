// Função para converter valores monetários para números
function parseCurrency(value) {
    return parseFloat(value.replace(/[^\d.,-]/g, '').replace(',', '.'));
}

// Função para adição
function addition(a, b) {
    // Verifica se os valores são do mesmo tipo
    if ((a instanceof Date && !(b instanceof Date)) || (!(a instanceof Date) && b instanceof Date)) {
        throw new Error("Adição aceita somente valores do mesmo tipo.");
    }

    // Verifica se os valores são do tipo Date e converte para milissegundos
    if (a instanceof Date) {
        a = a.getTime();
    }
    if (b instanceof Date) {
        b = b.getTime();
    }

    // Realiza a adição
    return a + b;
}

// Função para subtração
function subtraction(a, b) {
    // Verifica se os valores são do mesmo tipo
    if ((a instanceof Date && !(b instanceof Date)) || (!(a instanceof Date) && b instanceof Date)) {
        throw new Error("Subtração aceita somente valores do mesmo tipo.");
    }

    // Verifica se os valores são do tipo Date e converte para milissegundos
    if (a instanceof Date) {
        a = a.getTime();
    }
    if (b instanceof Date) {
        b = b.getTime();
    }

    // Realiza a subtração
    return a - b;
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
    // Verifica se os valores são do tipo Date ou monetário
    if (a instanceof Date || b instanceof Date) {
        throw new Error("Divisão não aceita valores do tipo Date.");
    }
    if (typeof a === 'string' || typeof b === 'string') {
        throw new Error("Divisão não aceita valores monetários.");
    }

    // Realiza a divisão
    if (b !== 0) {
        return a / b;
    } else {
        throw new Error("Não é possível dividir por zero!");
    }
}
