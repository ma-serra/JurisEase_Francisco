import './DrawerTemplate.css'
import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { addTemplate, removeTemplate } from '../../../utils/data_base/firebase/dao/templateDAO';
import FormTemplate from '../FormTemplate/FormTemplate';
import { validateFormTemplate } from '../validations';

function DrawerTemplate({ type, data, onClose }) {

    const [errors, setErrors] = useState({});
    
    const [template, setTemplate] = useState({
        title: data.title || "",
        rout: data.rout || [],
        keys: data.keys || [],
        contents: {
            base: data.contents?.base || "",
            fatos: data.contents?.fatos || "",
            fundamentos: data.contents?.fundamentos || "",
            pedidos: data.contents?.pedidos || "",
        },
        typeTermination: data.typeTermination || "",
        numberOfComplaints: data.numberOfComplaints || "",
        typesResponsibilities: data.typesResponsibilities || ['Principal'],
    });

    const handleDeleteTemplate = async () => {
        await removeTemplate(data.id, type);
        onClose();
    };

    const handleSaveTemplate = async () => {
        const errrosForm = validateFormTemplate(template, type)
        setErrors(errrosForm)
        if (Object.keys(errrosForm).length === 0){
            console.log('Salvando')
            await addTemplate(template, type)
            onClose()
        }
    };

    return (
        <div className='back-drawer-template'>
            <div className='drawer-template'>
                <h2 className='title-template'>Edição</h2>
                <MdDelete className='bt-delete-template' onClick={handleDeleteTemplate} />
                <FormTemplate type={type} template={template} setTemplate={setTemplate} errors={errors}/>
                <div className='bts-actions'>
                    <button className="bt-cancelar-template" onClick={onClose}>Cancelar</button>
                    <button className="bt-aplicar-template" onClick={handleSaveTemplate}>Aplicar</button>
                </div>
            </div>
        </div>
    );
}

export default DrawerTemplate;
