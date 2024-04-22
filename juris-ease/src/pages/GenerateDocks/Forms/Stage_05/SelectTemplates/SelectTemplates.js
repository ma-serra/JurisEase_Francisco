import './SelectTemplates.css'
import React, { useEffect, useState } from 'react';
import { getTemplates } from '../../../../../utils/data_base/firebase/dao/templateDAO';

function SelectTemplates({ templatesSelected, setTemplatesSelected }) {
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    const [rout, setRout] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const templatesData = await new Promise((resolve, reject) => {
                getTemplates((templatesData) => resolve(templatesData), "specific");
            });
            setTemplates(templatesData);
        };

        fetchData();
    }, []);

    const filterTemplatesByRout = (rout, templates) => {
        let filteredTemplates = [...templates];

        rout.forEach((routSection, index) => {
            filteredTemplates = filteredTemplates.filter((template) => template.rout[index] === routSection);
        });

        return filteredTemplates;
    };

    const handleCardClick = (template) => {
        const isTemplateSelected = templatesSelected.includes(template);
        if (isTemplateSelected) {
            setTemplatesSelected(prevTemplatesSelected => prevTemplatesSelected.filter(item => item !== template));
        } else {
            setTemplatesSelected(prevTemplatesSelected => [...prevTemplatesSelected, template]);
        }
    };

    const update = () => {
        const filtered = filterTemplatesByRout(rout, templates);
        setFilteredTemplates(filtered);
        const routOptions = filtered.map((template) => template.rout[rout.length]);
        setOptions(routOptions);
    };

    const handleChangeRout = (event) => {
        const selectedRout = event.target.value;
        setRout((prevRout) => [...prevRout, selectedRout]);
    };

    const undoRout = (index) => {
        setRout((prevRout) => prevRout.slice(0, index + 1));
    };

    const resetRout = () => {
        setRout([]);
    };

    useEffect(() => {
        update();
    }, [templates, rout]);

    return (
        <div className='SelectTemplate'>
            <h2 className='title'>Selecione seus templates</h2>

            <div className='rout-path'>
                <div>
                    <span className="path-span" onClick={resetRout}>Templates / </span>
                    {rout.map((rt, index) => (
                        <React.Fragment key={index}>
                            <span className="path-span" onClick={() => undoRout(index)}>{rt} / </span>
                        </React.Fragment>
                    ))}
                    <select name="rout" value={rout[rout.length - 1] || ''} onChange={handleChangeRout} className="select-option">
                        <option value="">Selecione</option>
                        {options.map((option, index) => (
                            <option key={index} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className='content-cards'>
                {filteredTemplates.map((template, index) => (
                    <div key={index} className={`card-template ${templatesSelected.includes(template) ? "selected" : ""}`} onClick={() => {handleCardClick(template)}}>
                        <h1 className='title'>{template.title}</h1>
                        <p className='rout'>{template.rout}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SelectTemplates;
