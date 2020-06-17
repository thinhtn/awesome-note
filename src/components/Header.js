import React from 'react';
import { useHistory } from 'react-router-dom';

function Header(props) {
  let history = useHistory();

  function handleClick() {
    history.push('/');
  }
  return (
    <header className='header'>
      <h3 className='title' onClick={handleClick}>
        Awesome<span>x</span>Note
      </h3>
    </header>
  );
}

export default Header;
