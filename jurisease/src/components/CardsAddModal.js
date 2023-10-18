import React, { useState } from 'react';
import { addServiceToDatabase, addHeadlineToDatabase } from '../bd/firebase/firebase';

function CardAddModal({ type }) {

  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState('clique-aqui.png'); // Imagem padrão
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event) => {

    const card = {
      title: title,
      description: description,
      image: image,
      link: link,
    }

    if (type === 'service') {
      addServiceToDatabase(card)
    } else
    if (type === 'headline') {
      addHeadlineToDatabase(card)
    }

    event.preventDefault();
    setImage('clique-aqui.png');
    setTitle('');
    setDescription('');
    setLink('');
  };

  return (
    <div className='content-card-modal'>
      {!isOpen && (
        <button className='bt-form' onClick={openModal}>Adicionar Novo Card</button>
      )}

      {isOpen && (
        <div className="add-card-modal">
          <img
            src={image}
            alt="Imagem do Card"
            onClick={() => document.getElementById('fileInput').click()}
          />
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Descrição"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </form>
          <div className='bt-form-card-modal'>
            <button className='bt-form cancel' onClick={closeModal}>Cancelar</button>
            <button className='bt-form add' onClick={handleSubmit}>Adicionar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardAddModal;
