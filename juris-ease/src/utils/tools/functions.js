import { formatHour, formatMonetary } from "./mask";

export const isMonetary = (value) => typeof value === 'string' && value?.trim().startsWith('R$');
export const isHour = (value) => typeof value === 'string' && /^\d{1,}:\d{2}$/.test(value);
export const isNumber = (value) => !isNaN(value) || !isNaN(parseFloat(value.replace('.', '').replace(',', '.')));
export const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

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

function parseNumber(value) {
    if (isNaN(value)) {
        return parseFloat(value.replace(/\./g, '').replace(',', '.'));
    }
    
    return value
}

function hourToNumber(hour) {
    const [hours, minutes] = hour.split(':').map(Number);
    return hours + minutes / 60;
}

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

function sum(elements, operation = 'sum') {
    const type = allSameType(elements);
    if (type === 'error' || type === 'empty') {
        throw new Error("Elements are not of the same type or list is empty");
    }

    switch (type) {
        case 'number':
            return sumNumbers(elements, operation);
        case 'monetary':
            return sumMonetary(elements, operation);
        case 'hour':
            return sumHours(elements, operation);
        default:
            throw new Error("Unsupported element type");
    }
}

function sumNumbers(elements, operation) {
    let result;
    if (operation === 'subtract') {
        result = elements.slice(1).reduce((acc, val) => acc - parseNumber(val), parseNumber(elements[0]));
    } else {
        result = elements.reduce((acc, val) => acc + parseNumber(val), 0);
    }
    return parseFloat(result.toFixed(2)).toString().replace('.', ',');
}

function sumMonetary(elements, operation) {
    if (operation === 'subtract') {
        const initial = parseNumber(elements[0].replace(/[^\d.,]/g, ''));
        const total = elements.slice(1).reduce((acc, val) => {
            const normalizedValue = parseNumber(val.replace(/[^\d.,]/g, ''));
            return acc - normalizedValue;
        }, initial);
        return `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
    const total = elements.reduce((acc, val) => {
        const normalizedValue = parseNumber(val.replace(/[^\d.,]/g, ''));
        return acc + normalizedValue;
    }, 0);
    return `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function sumHours(elements, operation) {
    if (operation === 'subtract') {
        const [initialHours, initialMinutes] = elements[0].split(':').map(Number);
        let totalMinutes = initialHours * 60 + initialMinutes;
        totalMinutes = elements.slice(1).reduce((acc, val) => {
            const [hours, minutes] = val.split(':').map(Number);
            const totalMinutesForValue = hours * 60 + minutes;
            return acc - totalMinutesForValue;
        }, totalMinutes);

        const hours = Math.floor(Math.abs(totalMinutes) / 60);
        const minutes = Math.abs(totalMinutes) % 60;
        const sign = totalMinutes < 0 ? '-' : '';
        return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    let totalMinutes = elements.reduce((acc, val) => {
        const [hours, minutes] = val.split(':').map(Number);
        const totalMinutesForValue = hours * 60 + minutes;
        return acc + totalMinutesForValue;
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function multiplication(elements) {
    return processElements(elements, 'multiplication');
}

function division(elements) {
    if (elements.length < 2) {
        throw new Error('São necessários pelo menos dois valores para a divisão.');
    }
    return processElements(elements, 'division');
}

function convertTo(result, type) {
    switch (type) {
        case 'number':
            return parseFloat(result.toFixed(2));

        case 'monetary':
            return `R$ ${parseFloat(result.toFixed(2)).toString().replace('.', ',')}`;

        case 'hour':
            const totalMinutes = result * 60;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = Math.round(totalMinutes % 60);
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        default:
            throw new Error('Tipo de resultado desconhecido.');
    }
}

function processElements(elements, operation) {
    let numNumbers = 0;
    let numMonetaries = 0;
    let numHours = 0;
    let result = operation === 'multiplication' ? 1 : undefined;

    console.log(`${operation} - ${elements}`) 
    elements.map(element => {
        let parsedValue;

        if (isNumber(element)) {
            numNumbers++;
            parsedValue = parseNumber(element);

        } else if (isMonetary(element)) {
            numMonetaries++;
            parsedValue = parseNumber(element.replace(/[^\d.,]/g, ''));

        } else if (isHour(element)) {
            numHours++;
            parsedValue = hourToNumber(element);

        } else {
            throw new Error('Parâmetro inválido: deve ser um número, valor monetário (ex: "R$ 12,00") ou hora (ex: "12:30").');
        }

        if (numMonetaries > 1) throw new Error('Não pode ter mais de 1 valor monetário.');
        if (numHours > 1) throw new Error('Não pode ter mais de 1 valor de hora.');

        if (operation === 'multiplication') {
            result *= parsedValue;
        } else if (operation === 'division') {
            if (parsedValue === 0) return 'impossível';
            result = (result === undefined) ? parsedValue : result / parsedValue;
        }
    })

    const type = numMonetaries === 1 ? 'monetary' : numHours === 1 ? "hour" : "number";
    return convertTo(result, type);
}

const getDifferenceInDays = (date1, date2) => {
    if (!isDate(date1) || !isDate(date2)) return ''

    // Converte as datas em objetos Date
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Calcula a diferença em milissegundos
    const diffInMs = d2 - d1;

    // Converte a diferença de milissegundos para dias
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    // Retorna a diferença em dias
    return diffInDays || "0";
};

export const functions = {
    sum: {
        name: "Soma",
        manyParams: true,
        minParams: 2,
        typesPermitted: ["monetary", "number", "hours"],
        execute: (params) => sum(params, "sum"),
    },
    subtract: {
        name: "Subtração",
        manyParams: true,
        minParams: 2,
        typesPermitted: ["monetary", "number", "hours"],
        execute: (params) => sum(params, "subtract"),
    },
    division: {
        name: "Divisão",
        manyParams: true,
        minParams: 2,
        typesPermitted: ["monetary", "number", "hours"],
        execute: (params) => division(params),
    },
    multiplication: {
        name: "Multiplicação",
        manyParams: true,
        minParams: 2,
        typesPermitted: ["monetary", "number", "hours"],
        execute: (params) => multiplication(params),
    },
    dateDifference: {
        name: "Diferença entre datas",
        manyParams: false,
        minParams: 2,
        typesPermitted: ["date"],
        execute: (params) => getDifferenceInDays(params[0], params[1]),
    },
}
