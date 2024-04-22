import '../Stage.css'
import React, { useEffect, useState } from 'react';
import SheetPreview from './SheetPreview/SheetPreview';
import ManagmentForms from './ManagmentForms/ManagmentForms';
import SelectTemplates from './SelectTemplates/SelectTemplates';

function Stage05({ form, setForm, templateBase }) {

    const [content, setContent] = useState('')
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        const data = templateBase.contents.base
        setContent(data)
    }, [templateBase]);

    return (
        <div className='content-stage5'>
            <SelectTemplates templatesSelected={templates} setTemplatesSelected={setTemplates} />

            <ManagmentForms form={form} setForm={setForm} templates={templates} />

            <SheetPreview content={content}/>
        </div>
    );
}

export default Stage05;
