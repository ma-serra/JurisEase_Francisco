import '../Stage.css'
import React, { useEffect, useState } from 'react';
import SheetPreview from './SheetPreview/SheetPreview';
import ManagmentForms from './ManagmentForms/ManagmentForms';
import SelectTemplates from './SelectTemplates/SelectTemplates';

function Stage05({ form, setForm, templateBase, content, setContent }) {

    const [templates, setTemplates] = useState([]);

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
        let content = generateContent()
        setContent(content)
    }, [templates, templateBase.contents.base]);

    function replaceKeys() {
        let content = generateContent()

        Object.keys(form).forEach((key) => {
            const regex = new RegExp(key, 'g');
            content = content.replace(regex, form[key] || '');
        });

        return content;
    }

    useEffect(() => {
        setContent(replaceKeys());
    }, [form]);

    return (
        <div className='content-stage5'>
            <SelectTemplates templatesSelected={templates} setTemplatesSelected={setTemplates} />

            <ManagmentForms form={form} setForm={setForm} templates={templates} />

            <SheetPreview content={content} />
        </div>
    );
}

export default Stage05;
