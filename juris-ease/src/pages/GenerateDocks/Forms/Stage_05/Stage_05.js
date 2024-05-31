import '../Stage.css'
import React, { useEffect, useRef, useState } from 'react';
import SheetPreview from './SheetPreview/SheetPreview';
import ManagmentForms from './ManagmentForms/ManagmentForms';
import SelectTemplates from './SelectTemplates/SelectTemplates';
import { formatDate, formatNumbersWithTwoDecimals } from '../../../../utils/tools/mask';
import { isDate } from '../../../../utils/tools/functions';

function Stage05({ form, setForm, templateBase, content, setContent, templates, setTemplates, contentRef }) {

    const contentScrollRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    function clearFormTemplate(template) {
        setForm(prevState => {
            if (!template || !Array.isArray(template.keys)) {
                return prevState;
            }
    
            const updatedForm = { ...prevState };
            template.keys.forEach(key => {
                if (key.id) {
                    updatedForm[key.id] = "";
                }
            });
    
            return updatedForm;
        });
    }

    useEffect(() => {
        replaceKeys()
    }, [form]);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const rect = contentScrollRef.current.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;

            if (mouseX < 50) {
                contentScrollRef.current.scrollLeft -= 15;
            } else if (mouseX > rect.width - 50) {
                contentScrollRef.current.scrollLeft += 15;
            }
        };

        contentScrollRef.current.addEventListener('mousemove', handleMouseMove);

        return () => {
            contentScrollRef.current?.removeEventListener('mousemove', handleMouseMove);
        };
    }, [contentScrollRef]);

    return (
        <div className='content-stage5' ref={contentScrollRef}>
            <SelectTemplates templatesSelected={templates} setTemplatesSelected={setTemplates} onChange={replaceKeys} setCurrentIndex={setCurrentIndex} clearFormTemplate={clearFormTemplate} />

            <ManagmentForms form={form} setForm={setForm} templates={templates} templateBase={templateBase} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />

            <SheetPreview content={content} contentRef={contentRef} />
        </div>
    );
}

export default Stage05;
