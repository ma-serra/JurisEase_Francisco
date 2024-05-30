import './SheetPreview.css'
import React from 'react';

function SheetPreview({content, contentRef}) {
    return (
        <div className={`SheetPreview`}>
            <div className='sheet' ref={contentRef}>
                <div className='content' dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
}

export default SheetPreview;