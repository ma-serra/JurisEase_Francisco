import './SheetPreview.css'

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