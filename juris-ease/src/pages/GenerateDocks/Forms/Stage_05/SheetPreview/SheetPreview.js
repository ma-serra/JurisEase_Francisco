// import './SheetPreview.css'
import React from 'react';

function SheetPreview({content}) {
    return (
        <div className={`SheetPreview`}>
            <div className='sheet'>
                <div className='content' dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
}

export default SheetPreview;