import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import Header from './components/Header';
import Notes from './components/Notes';
import Home from './components/Home';
import NoteDetail from './components/NoteDetail';

export class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
          <Header />
          <main>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route exact path='/:name'>
              <Notes />
            </Route>
            <Route exact path='/:name/:id'>
              <NoteDetail />
            </Route>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
