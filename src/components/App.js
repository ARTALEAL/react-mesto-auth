import React, { useState, useEffect } from 'react';
import '../index.css';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import { api } from '../utils/Api';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import PopupWithConfirmation from './PopupWithConfirmation';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isOpenCardPopup, setIsOpenCardPopupOpen] = useState(false);
  const [isOpenPopupWithConfirmation, setIsOpenPopupWithConfirmation] =
    useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [removedCardId, setRemovedCardId] = useState('');
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  //Api states
  const [userAvatar, setUserAvatar] = useState('');
  const [userName, setUserName] = useState('');
  const [userDescription, setUserDescription] = useState('');
  const [cards, setCards] = useState([]);

  const [currentUser, setCurrentUser] = useState({});

  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([user, cards]) => {
        setUserName(user.name);
        setUserDescription(user.about);
        setUserAvatar(user.avatar);
        setCurrentUser(user);
        setCards([...cards]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function checkPopUpOpen() {
    if (isEditAvatarPopupOpen) {
      setIsOpenPopup(true);
    }
    if (isEditProfilePopupOpen) {
      setIsOpenPopup(true);
    }
    if (isAddPlacePopupOpen) {
      setIsOpenPopup(true);
    }
    if (isOpenCardPopup) {
      setIsOpenPopup(true);
    }
    if (isOpenPopupWithConfirmation) {
      setIsOpenPopup(true);
    }
  }

  const openEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const openAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const openEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleCardClick = (card) => {
    setIsOpenCardPopupOpen(true);
    setSelectedCard(card);
  };

  const openPopupWithConfirmation = (cardId) => {
    setIsOpenPopupWithConfirmation(true);
    setRemovedCardId(cardId);
  };

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      });
  }

  function handleCardDelete(card) {
    const cardId = card._id;
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((card) => card._id !== cardId));
        setIsOpenPopupWithConfirmation(false);
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsOpenCardPopupOpen(false);
    setIsOpenPopupWithConfirmation(false);
  };

  function handleUpdateUser(newUserInfo) {
    setIsLoading(true);
    api
      .editUserInfo(newUserInfo)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setIsLoading(false));
  }

  function handleUpdateAvatar(newData) {
    setIsLoading(true);
    api
      .editAvatar(newData)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Ошибка: ${err}`);
      })
      .finally(() => setIsLoading(false));
  }

  function handleAddPlaceSubmit(newCard) {
    setIsLoading(true);
    api
      .addCard(newCard)
      .then((data) => {
        setCards([data, ...cards]);
        closeAllPopups();
      })
      .finally(() => setIsLoading(false));
  }

  // Hook
  function useKeyPress(targetKey) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false);
    // If pressed key is our target key then set to true
    function downHandler({ key }) {
      if (key === targetKey) {
        setKeyPressed(true);
        closeAllPopups();
      }
    }
    // If released key is our target key then set to false
    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };
    // Add event listeners
    useEffect(() => {
      checkPopUpOpen();
      isOpenPopup && window.addEventListener('keydown', downHandler);
      isOpenPopup && window.addEventListener('keyup', upHandler);
      // Remove event listeners on cleanup
      return () => {
        setIsOpenPopup(false);
        isOpenPopup && window.removeEventListener('keydown', downHandler);
        isOpenPopup && window.removeEventListener('keyup', upHandler);
      };
    });
    return keyPressed;
  }

  useKeyPress('Escape');

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="page">
          <Header />
          <Main
            onEditAvatar={openEditAvatarClick}
            onEditProfile={openEditProfileClick}
            onAddPlace={openAddPlaceClick}
            userAvatar={userAvatar}
            userName={userName}
            userDescription={userDescription}
            cards={cards}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={openPopupWithConfirmation}
          />
          <Footer />

          {/* POPUP profile */}
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            onLoading={isLoading}
          />

          {/* PopUP addCard */}
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            onLoading={isLoading}
          />

          {/* PopUP edit Avatar */}
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            onLoading={isLoading}
          />

          <ImagePopup
            isOpen={isOpenCardPopup}
            card={selectedCard}
            onClose={closeAllPopups}
          ></ImagePopup>
          <PopupWithConfirmation
            isOpen={isOpenPopupWithConfirmation}
            onClose={closeAllPopups}
            onLoading={isLoading}
            onSubmit={handleCardDelete}
            card={removedCardId}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
