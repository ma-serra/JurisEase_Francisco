import '../Stage.css'
import React, { useEffect } from 'react';
import SheetPreview from './SheetPreview/SheetPreview';
import ManagmentForms from './ManagmentForms/ManagmentForms';
import SelectTemplates from './SelectTemplates/SelectTemplates';
import { formatDate, formatNumbersWithTwoDecimals } from '../../../../utils/tools/mask';
import { isDate } from '../../../../utils/tools/functions';

function Stage05({ form, setForm, templateBase, content, setContent, templates, setTemplates, contentRef }) {

    function generateContent() {
        // Inicializa variáveis para armazenar os conteúdos concatenados
        let conct_fatos = '';
        let conct_fundamentos = '';
        let conct_pedidos = '';

        // Concatena os conteúdos dos templates selecionados de acordo com a área correspondente
        templates.forEach(template => {
            if (template.contents.fatos) conct_fatos += template.contents.fatos;
            if (template.contents.fundamentos) conct_fundamentos += template.contents.fundamentos;
            if (template.contents.pedidos) conct_pedidos += template.contents.pedidos;
        });

        // Substitui as chaves no templateBase.contents.base pelos conteúdos concatenados
        let newContent = templateBase.contents.base;
        newContent = newContent.replace('{{fatos}}', conct_fatos);
        newContent = newContent.replace('{{fundamentos}}', conct_fundamentos);
        newContent = newContent.replace('{{pedidos}}', conct_pedidos);

        return newContent;
    }

    useEffect(() => {
        const data = templateBase.contents.base
        setContent(data)
    }, [templateBase]);

    useEffect(() => {
        replaceKeys()
    }, [templates, templateBase.contents.base]);

    function replaceKeys() {
        let content = generateContent()

        Object.keys(form).forEach((key) => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            const value = formatNumbersWithTwoDecimals(form[key])
            if (isDate(value)) {
                content = content.replace(regex, formatDate(value) || '');
            } else {
                content = content.replace(regex, value || '');
            }
        });

        setContent(content)
    }

    useEffect(() => {
        replaceKeys()
    }, [form]);

    return (
        <div className='content-stage5'>
            <SelectTemplates templatesSelected={templates} setTemplatesSelected={setTemplates} onChange={replaceKeys}/>

            <ManagmentForms form={form} setForm={setForm} templates={templates} templateBase={templateBase} />

            <SheetPreview content={content} contentRef={contentRef}/>
        </div>
    );
}

export default Stage05;
