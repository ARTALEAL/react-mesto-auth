// import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
function Header({ loggedIn, userEmail, onSignOut }) {
  const location = useLocation();

  // const [isMenuOpen, SetIsMenuOpen] = useState(false);

  // function openMenu() {
  //   const burger = document.querySelector('.burger');
  //   burger.classList.toggle('burger_open');
  //   SetIsMenuOpen(true);
  // }

  return (
    <header className="header">
      <div className="header__logo"></div>
      {location.pathname === '/sign-in' && (
        <Link to="/sign-up" className="header__link">
          Регистрация
        </Link>
      )}
      {location.pathname === '/sign-up' && (
        <Link to="/sign-in" className="header__link">
          Войти
        </Link>
      )}
      {loggedIn && (
        <>
          {/* <div className="burger" onClick={openMenu}>
            <span className="span"></span>
            <span className="span"></span>
            <span className="span"></span>
          </div> */}
          <nav className="header__nav">
            <span>{userEmail}</span>
            <button className="header__sign-out" onClick={() => onSignOut()}>
              Выйти
            </button>
          </nav>
        </>
      )}
    </header>
  );
}

export default Header;
