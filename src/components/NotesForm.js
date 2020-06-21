import React, { Component } from 'react';
import * as firebase from 'firebase';

export class NotesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      note: '',
      files: [],
      urls: [],
      inputKey: 1,
    };

    this.createNote = this.createNote.bind(this);
  }

  onChangeHandler(evt, key) {
    this.setState({
      [key]: evt.target.value,
    });
  }

  handleChangeFile(e) {
    console.log('e.target.files', e.target.files);
    let files = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const newFile = e.target.files[i];
      newFile['id'] = Math.random();
      files.push(newFile);
    }
    this.setState({
      files: files,
    });
  }

  async createNote(e) {
    let self = this;
    if (this.state.title !== '') {
      e.preventDefault(); // prevent page refreshing
      const promises = [];
      let urls = [];
      this.state.files.forEach((file) => {
        const uploadTask = firebase
          .storage()
          .ref()
          .child(`files/${file.name}`)
          .put(file);
        promises.push(uploadTask);
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (snapshot.state === firebase.storage.TaskState.RUNNING) {
              console.log(`Progress: ${progress}%`);
            }
          },
          (error) => console.log(error.code),
          async () => {
            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
            console.log('downloadURL', downloadURL);
            urls.push(downloadURL);
            // do something with the url
            if (urls.length === self.state.files.length) {
              firebase
                .database()
                .ref(self.props.name)
                .push({
                  title: self.state.title,
                  note: self.state.note !== '' ? self.state.note : null,
                  urls: urls,
                });
              alert('Create note successfully!');
              self.setState({
                title: '',
                note: '',
                files: [],
                urls: [],
                inputKey: Date.now(),
              });
            }
          }
        );
      });

      if (this.state.files.length > 0) {
        await Promise.all(promises)
          .then(() => {
            console.log('All files uploaded');
          })
          .catch((err) => console.log(err.code));
      } else {
        let urls = [];
        urls = [...this.state.urls];
        let id = firebase
          .database()
          .ref(this.props.name)
          .push({
            title: this.state.title,
            note: this.state.note !== '' ? this.state.note : null,
            urls: urls,
          });
        console.log('id after :>> ', id);
        alert('Create note successfully!');
        self.setState({
          title: '',
          note: '',
          files: [],
          urls: [],
          inputKey: Date.now(),
        });
      }
    }
  }

  render() {
    return (
      <section className='noteform'>
        <h3>Create New Note</h3>
        <div className='form-group'>
          <label htmlFor='noteform-title'>Title *</label>
          <input
            type='text'
            id='noteform-title'
            name='noteform-title'
            value={this.state.title}
            onChange={(evt) => this.onChangeHandler(evt, 'title')}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='noteform-note'>Note</label>
          <textarea
            name='noteform-note'
            id='noteform-note'
            value={this.state.note}
            onChange={(evt) => this.onChangeHandler(evt, 'note')}
          ></textarea>
        </div>
        <div className='form-group'>
          <label htmlFor='noteform-file'>Upload File</label>
          <input
            type='file'
            multiple
            key={this.state.inputKey}
            onChange={(e) => this.handleChangeFile(e)}
          />
        </div>
        <button disabled={this.state.title ? false : true} onClick={(e) => this.createNote(e)}>Create Note</button>
      </section>
    );
  }
}

export default NotesForm;
