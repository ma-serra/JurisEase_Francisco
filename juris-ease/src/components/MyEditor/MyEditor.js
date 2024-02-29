import React, { Component } from 'react';

import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { CKEditor } from '@ckeditor/ckeditor5-react';

class MyEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parameter: 'data'
        };
    }

    render() {
        return (
            <div className='MyEditor'>
                <CKEditor
                    editor={ClassicEditor}
                    data={this.props.data} // Utiliza a propriedade data fornecida
                    onReady={editor => {
                        console.log('Editor is ready to use!', editor);
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        this.setState({ parameter: 'data' }); // Atualiza o parâmetro para 'data'
                        this.props.onDataChange(data); // Chama a função onDataChange para atualizar o valor no componente pai
                    }}
                    onBlur={(event, editor) => {
                        console.log('Blur.', editor);
                    }}
                    onFocus={(event, editor) => {
                        console.log('Focus.', editor);
                    }}
                    parameter={this.state.parameter} // Passa o parâmetro como uma propriedade
                />
            </div>
        );
    }
}

export default MyEditor;
