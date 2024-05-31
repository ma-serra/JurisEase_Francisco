import './SelectTemplates.css'
import React, { useEffect, useState } from 'react';
import { getTemplates } from '../../../../../utils/data_base/firebase/dao/templateDAO';

function SelectTemplates({ templatesSelected, setTemplatesSelected, onChange, setCurrentIndex, clearFormTemplate }) {
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

    const handleCardClick = async (template) => {
        const isTemplateSelected = verifyIncludes(templatesSelected, template)

        if (isTemplateSelected) {
            await setTemplatesSelected(prev => {
                const updateTemplates = prev.filter(item => item.id !== template.id)  // Pegando todos menos o que foi clicado
                return updateTemplates
            })

            setCurrentIndex(templatesSelected.length-2) // Pega o index do penultimo template selecionado
            clearFormTemplate(template)
        } else {
            await setTemplatesSelected(prev => {
                const updateTemplates = prev ? [...prev] : [] 
                updateTemplates.push(template)
                return updateTemplates
            })

            setCurrentIndex(templatesSelected.length) // Pega o index do penultimo template selecionado
        }

        onChange()
    };

    function verifyIncludes(array, element) {
        return !!array.filter(e => e.id === element.id).length
    }

    const update = () => {

        const filtered = rout.length ? filterTemplatesByRout(rout, templates) : templates
        setFilteredTemplates(filtered);

        const routOptions = new Set();
        filtered.forEach(template => {
            const option = template.rout[rout.length];
            routOptions.add(option);
        });

        setOptions(Array.from(routOptions));
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
                    <div key={index} className={`card-template ${verifyIncludes(templatesSelected, template) ? "selected" : ""}`} onClick={() => { handleCardClick(template) }}>
                        <h1 className='title'>{template.title}</h1>
                        <p className='rout'>{template.rout}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SelectTemplates;
