import React, { Component } from 'react';
import * as firebase from 'firebase';
import { withRouter } from 'react-router-dom';
import Linkify from 'react-linkify';
import EditIcon from '../assets/EditIcon';
import NotesForm from './NotesForm';

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
    this.name = this.props.match.params.name;
    this.db = firebase.database();
    this.listenForChange();
  }

  listenForChange() {
    console.log('listenForChange');
    this.db.ref(this.name).on('child_added', (snapshot) => {
      console.log('listenForChange child_added');
      let note = {
        id: snapshot.key,
        title: snapshot.val().title,
        note: snapshot.val().note,
      };

      let notes = this.state.notes;
      notes.push(note);

      this.setState({
        notes: notes,
      });
    });

    this.db.ref(this.name).on('child_changed', (snapshot) => {
      console.log('listenForChange child_changed');
      let notes = this.state.notes;
      var foundIndex = notes.findIndex((x) => x.id === snapshot.key);
      notes[foundIndex].note = snapshot.val().note;

      this.setState({
        notes: notes,
      });
    });

    this.db.ref(this.name).on('child_removed', (snapshot) => {
      console.log('listenForChange child_removed');
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

  handleEdit(id) {
    let newEdit = this.state.isEdit;
    this.setState({
      isEdit: !newEdit,
      chosenId: id,
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
    firebase
      .database()
      .ref(this.name)
      .child(id)
      .update({ note: this.state.note });
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
                  <h3 onClick={() => this.handleShowDetail(note.id)}>
                    {note.title}
                  </h3>
                  <EditIcon
                    className='remove'
                    width='34'
                    height='34'
                    onClick={() => this.handleEdit(note.id)}
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
                        value={this.state.note || note.note}
                        onChange={(evt, note) =>
                          this.onChangeHandler(evt, 'note', note)
                        }
                      />
                      <div>
                        <button onClick={() => this.handleUpdate(note.id)}>
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
