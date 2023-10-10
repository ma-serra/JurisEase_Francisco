import React from 'react';

function ManchetesSection({ orientation }) {
    return (
        <div className={`manchetes-content ${orientation}`}>
            <h2>Áreas de Manchetes</h2>

            <div className="card">
                <h2>Manchete 1</h2>
                <p>Descrição do primeiro manchete oferecido pelo advogado.</p>
            </div>

            <div className="card">
                <h2>Manchete 2</h2>
                <p>Descrição do segundo manchete oferecido pelo advogado.</p>
            </div>

            <div className="card">
                <h2>Manchete 3</h2>
                <p>Descrição do terceiro manchete oferecido pelo advogado.</p>
            </div>
        </div>
    );
}

export default ManchetesSection;