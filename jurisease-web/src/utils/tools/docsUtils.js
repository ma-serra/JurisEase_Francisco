import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export async function modifyPDF(file, valueMap) {
  try {
    const pdfText = await readFileAsText(file);

    // Função para substituir chaves pelos valores no PDF
    const replaceKeys = (text) => {
      for (const key in valueMap) {
        const regex = new RegExp(`{${key}}`, 'g');
        text = text.replace(regex, valueMap[key]);
      }
      return text;
    };

    const modifiedText = replaceKeys(pdfText);

    // Criar um novo documento pdfmake com o texto modificado
    const modifiedDocDefinition = {
      content: [
        { text: modifiedText, fontSize: 12 },
      ],
    };

    // Criar o PDF usando pdfmake
    const modifiedPdfBuffer = pdfMake.createPdf(modifiedDocDefinition).getBuffer();

    // Retornar os bytes do novo PDF
    return modifiedPdfBuffer;
  } catch (error) {
    throw new Error('Erro ao modificar o PDF: ' + error.message);
  }
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
}
