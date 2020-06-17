import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Home(props) {
  const [name, setName] = useState('');

  let history = useHistory();

  function onChangeHandler(evt, key) {
    setName(evt.target.value);
  }

  function handleClick() {
    history.push('/' + name);
  }

  return (
    <div>
      <div>Type your page name</div>
      <input
        type='text'
        value={name}
        onChange={(evt) => onChangeHandler(evt, 'name')}
      />
      <button onClick={handleClick}>Go</button>
    </div>
  );
}

export default Home;
