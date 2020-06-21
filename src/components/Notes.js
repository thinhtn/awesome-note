import React, { Component } from 'react';
import * as firebase from 'firebase';
import { withRouter } from 'react-router-dom';
import Linkify from 'react-linkify';
import EditIcon from '../assets/EditIcon';
import AttachedIcon from '../assets/attached.png';
import NotesForm from './NotesForm';
import { storage } from '../firebase';

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      isEdit: false,
      chosenId: '',
      title: '',
      note: '',
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    console.log('Initialize Notes');
    console.log('API_KEY :>> ', process.env.API_KEY);
    console.log('APP_ID :>> ', process.env.APP_ID);
    this.name = this.props.match.params.name;
    this.db = firebase.database();
    this.listenForChange();
  }

  listenForChange() {
    this.db.ref(this.name).on('child_added', (snapshot) => {
      let note = {
        id: snapshot.key,
        title: snapshot.val().title,
        note: snapshot.val().note,
        files: snapshot.val().urls,
      };

      let notes = this.state.notes;
      notes.push(note);

      this.setState({
        notes: notes,
      });
    });

    this.db.ref(this.name).on('child_changed', (snapshot) => {
      let notes = this.state.notes;
      var foundIndex = notes.findIndex((x) => x.id === snapshot.key);
      notes[foundIndex] = snapshot.val();

      this.setState({
        notes: notes,
      });
    });

    this.db.ref(this.name).on('child_removed', (snapshot) => {
      let notes = this.state.notes;
      notes = notes.filter((note) => note.id !== snapshot.key);

      this.setState({
        notes: notes,
      });
    });
  }

  removeNote(id) {
    firebase.database().ref(this.name).child(id).remove();
  }

  editNote(id) {
    firebase.database().ref(this.name).child(id).update();
  }

  handleEdit(id, note, title) {
    let newEdit = this.state.isEdit;
    this.setState({
      isEdit: !newEdit,
      chosenId: id,
      note: note,
      title: title,
    });
  }

  onChangeHandler(evt, key) {
    this.setState({
      [key]: evt.target.value,
    });
  }

  handleShowDetail(id) {
    const { history } = this.props;
    if (history) history.push('/' + this.name + '/' + id);
  }

  handleUpdate(id) {
    firebase.database().ref(this.name).child(id).update({
      title: this.state.title,
      note: this.state.note,
    });
    this.setState({
      isEdit: false,
    });
  }

  handleCancel() {
    this.setState({
      isEdit: false,
    });
  }

  render() {
    return (
      <section className='notes-wrapper'>
        <NotesForm name={this.props.match.params.name} />
        <h3>Notes</h3>
        <div className='notes'>
          {this.state.notes.length > 0 ? (
            this.state.notes.map((note) => (
              <div className='note' key={note.id}>
                <div className='note-title'>
                  {this.state.isEdit && this.state.chosenId === note.id ? (
                    <input
                      type='text'
                      value={this.state.title}
                      onChange={(evt, note) =>
                        this.onChangeHandler(evt, 'title', note)
                      }
                    />
                  ) : (
                    <h3 onClick={() => this.handleShowDetail(note.id)}>
                      {note.title}
                    </h3>
                  )}

                  {note.files && note.files[0] !== '' ? (
                    <img
                      src={AttachedIcon}
                      alt='attached'
                      style={{ width: '30px', height: '30px' }}
                    />
                  ) : (
                    ''
                  )}
                  <EditIcon
                    className='remove'
                    width='34'
                    height='34'
                    onClick={() => this.handleEdit(note.id, note.note, note.title)}
                  />
                  <div
                    className='remove'
                    onClick={() => this.removeNote(note.id)}
                  >
                    x
                  </div>
                </div>
                <div className='note-content'>
                  {this.state.isEdit && this.state.chosenId === note.id ? (
                    <div>
                      <input
                        type='text'
                        value={this.state.note}
                        onChange={(evt, note) =>
                          this.onChangeHandler(evt, 'note', note)
                        }
                      />
                      <div>
                        <button
                          disabled={
                            note.title === this.state.title && note.note === this.state.note ? true : false
                          }
                          onClick={() => this.handleUpdate(note.id)}
                        >
                          Save
                        </button>
                        <button onClick={this.handleCancel}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p>
                      <Linkify>{note.note}</Linkify>
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>No data to show</div>
          )}
        </div>
      </section>
    );
  }
}

export default withRouter(Notes);
