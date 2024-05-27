import { extractKeys } from '../../../utils/tools/tools';

export function autoGenerateKeys(currentKeys, contents) {
    const keysFound = [];

    for (const content of Object.values(contents)) {
        const keys = extractKeys(content);
        keysFound.push(...keys);
    }

    const uniqueKeys = [...new Set(keysFound)];

    // Cria uma nova cópia de currentKeys
    const newKeys = [...currentKeys];

    // Mapeia cada chave para o formato de objeto desejado, mantendo as configurações das chaves existentes
    uniqueKeys.forEach(key => {
        const existingKey = currentKeys.find(k => k.id === key);
        if (!existingKey) {
            newKeys.push({ id: key, type: 'text' });
        }
    });

    // Retorna as novas chaves geradas
    return newKeys;
}
