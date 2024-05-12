import { extractKeys } from '../../../utils/tools/tools'

export function autoGenerateKeys(currentKeys, contents) {
    const allKeys = [];

    for (const content of Object.values(contents)) {
        const keys = extractKeys(content);
        allKeys.push(...keys);
    }

    const uniqueKeys = [...new Set(allKeys)];

    // Mapeia cada chave para o formato de objeto desejado, mantendo as configurações das chaves existentes
    const keysArray = uniqueKeys.map((key, index) => {
        const existingKey = currentKeys.find(k => k.id === key);

        return {
            id: key,
            type: existingKey ? existingKey.type : 'text',
            function: existingKey ? existingKey.function : { operation: '', params: [] }
        };
    });

    // Retorna as novas chaves geradas
    return keysArray;
}
