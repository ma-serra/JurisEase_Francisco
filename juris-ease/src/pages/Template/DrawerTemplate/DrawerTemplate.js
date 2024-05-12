import './DrawerTemplate.css'
import React, { useState } from 'react';
import { MdDelete } from 'react-icons/md';
import { removeTemplate } from '../../../utils/data_base/firebase/dao/templateDAO';
import FormTemplate from '../FormTemplate/FormTemplate';

function DrawerTemplate({ type, data, onClose }) {

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
        console.log(template)
    };

    return (
        <div className='back-drawer-template'>
            <div className='drawer-template'>
                <h2 className='title-template'>Edição</h2>
                <MdDelete className='bt-delete-template' onClick={handleDeleteTemplate} />
                <FormTemplate type={type} template={template} setTemplate={setTemplate} />
                <div className='bts-actions'>
                    <button className="bt-cancelar-template" onClick={onClose}>Cancelar</button>
                    <button className="bt-aplicar-template" onClick={handleSaveTemplate}>Aplicar</button>
                </div>
            </div>
        </div>
    );
}

export default DrawerTemplate;
