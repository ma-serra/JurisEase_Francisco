import React from 'react';

function ServiceSection({ orientation }) {
    return (
        <div className={`services-content ${orientation}`}>
            <h2>Áreas de Serviços</h2>

            <div className="card">
                <h2>Serviço 1</h2>
                <p>Descrição do primeiro serviço oferecido pelo advogado.</p>
            </div>

            <div className="card">
                <h2>Serviço 2</h2>
                <p>Descrição do segundo serviço oferecido pelo advogado.</p>
            </div>

            <div className="card">
                <h2>Serviço 3</h2>
                <p>Descrição do terceiro serviço oferecido pelo advogado.</p>
            </div>
        </div>
    );
}

export default ServiceSection;