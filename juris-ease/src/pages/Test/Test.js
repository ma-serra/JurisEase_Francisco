import './Test.css';
import React, { useEffect, useState } from 'react';

import CardTemplate from '../DocsEditor/Template/CardTemplate/CardTemplate';
import { getTemplates } from '../../utils/data_base/firebase/dao/templateDAO';
import { removeObjetosVazios } from '../../utils/tools/tools';

function Template() {
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        const fetchTemplatesAndListen = () => {
            getTemplates((templatesData) => {
                const templates = removeObjetosVazios(templatesData)
                setTemplates(templates);
                console.log("Templates:", templates)
            });
        };

        fetchTemplatesAndListen();
    }, []);

    return (
        <div className={`Test`}>
            <h1>Testes</h1>
            <div className='content-templates'>
                {templates.map((template, index) => (
                    <div className='template'>
                        <h3>{`CARD_${index}`}</h3>
                        <CardTemplate key={index} data={template} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Template;