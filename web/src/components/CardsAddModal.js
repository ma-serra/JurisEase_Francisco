import React, { useEffect, useState } from 'react';

function CardAddModal({ onAddCard, onRemoveCard, onUpdateCard, cardInEdition, onCancelEdit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cardData, setCardData] = useState({
    image: '/images/clique-aqui.png',
    title: '',
    description: '',
    link: '',
  });

  useEffect(() => {
    console.log("cardInEdition: ", cardInEdition)
    if (cardInEdition) {
      setCardData({
        id: cardInEdition.id,
        image: cardInEdition.image,
        title: cardInEdition.title,
        description: cardInEdition.description,
        link: cardInEdition.link,
        create: cardInEdition.create,
      });

      setIsOpen(true);
    }
  }, [cardInEdition]);

  const openModal = () => {
    setIsOpen(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCardData({ ...cardData, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = (event) => {
    event.preventDefault();
    applyCardOperation();
  };

  const applyCardOperation = () => {
    const card = {
      ...cardData,
    };

    if (cardInEdition) {
      // Se há um card em edição, atualize-o
      onUpdateCard(cardData);
    } else {
      // Caso contrário, adicione um novo card
      onAddCard(card);
    }

    resetCardData();

    setIsOpen(false);
  };

  const deleteCard = () => {
    onRemoveCard(cardInEdition.id);
    resetCardData();
    setIsOpen(false);
  };

  const cancelCard = () => {
    resetCardData();
    setIsOpen(false);
  };

  const resetCardData = () => {
    onCancelEdit()
    setCardData({
      image: 'clique-aqui.png',
      title: '',
      description: '',
      link: '',
    });
  };

  return (
    <div className='content-card-modal'>
      {!isOpen && (
        <button className='bt-form' onClick={openModal}>
          Adicionar Novo Card
        </button>
      )}

      {isOpen && (
        <div className="add-card-modal">
          <button className="bt-form bt-cancelar" onClick={cancelCard}> X </button>
          <img
            src={cardData.image}
            alt="Imagem do Card"
            onClick={() => document.getElementById('fileInput').click()}
          />
          <form onSubmit={handleApply}>
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
              value={cardData.title}
              onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
            />
            <textarea
              placeholder="Descrição"
              value={cardData.description}
              onChange={(e) => setCardData({ ...cardData, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Link"
              value={cardData.link}
              onChange={(e) => setCardData({ ...cardData, link: e.target.value })}
            />
          </form>
          <div className='bt-form-card-modal'>
            {cardInEdition && (
              <button className='bt-form cancel' onClick={deleteCard}>
                Deletar
              </button>
            )}
            <button className="bt-form add" onClick={handleApply}>
              {cardInEdition ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardAddModal;
