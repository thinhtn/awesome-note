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
      <div style={{marginTop: "30px"}}>
        How to use?
        <ul>
          <li>Type the name of your note.</li>
          <li>Click "Go" button.</li>
          <li>Create your own notes.</li>
          <li>Share with other devices by above steps on the devices or use QRcode inside each note.</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
