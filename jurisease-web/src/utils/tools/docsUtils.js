import * as pdfjsLib from 'pdfjs-dist'

export const lerDoc = (pdf) => {

    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker';
    pdfjsLib.getDocument('./ex1.pdf')

};
