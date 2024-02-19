// DocsUtils.js
import { PDFDocument, rgb } from 'pdf-lib';

export const modifyPDF = async (file, valueMap) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const firstPage = pdfDoc.getPages()[0];

    const fontSize = 12; // Escolha o tamanho da fonte conforme necessário

    // Extrair o texto da página usando pdf-lib
    const existingText = await extractTextFromPage(firstPage);

    // Substituir os valores do mapa no texto
    for (const [key, value] of Object.entries(valueMap)) {
      const searchString = `{${key}}`;
      existingText.replaceAll(searchString, value);
    }

    // Limpar a página antes de desenhar o novo texto
    firstPage.drawText(' '.repeat(existingText.length), {
      x: 0,
      y: firstPage.getHeight(),
      font: await pdfDoc.embedFont('Helvetica'), // Escolha a fonte conforme necessário
      fontSize,
      color: rgb(255, 255, 255), // Cor do texto (corresponde à cor de fundo)
    });

    // Desenhar o novo texto na posição correta
    firstPage.drawText(existingText, {
      x: 0,
      y: firstPage.getHeight() - fontSize, // Ajuste a posição conforme necessário
      font: await pdfDoc.embedFont('Helvetica'), // Escolha a fonte conforme necessário
      fontSize,
      color: rgb(0, 0, 0), // Cor do texto
    });

    const modifiedPdfBytes = await pdfDoc.save();
    return modifiedPdfBytes;
  } catch (error) {
    console.error('Erro ao modificar o PDF:', error);
    throw error;
  }
};

async function extractTextFromPage(page) {
  const text = await page.getText();
  return text;
}
