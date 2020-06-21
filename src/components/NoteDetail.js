import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as firebase from 'firebase';
import QRCode from 'qrcode.react';
import Linkify from 'react-linkify';
import ModalComponent from './ModalComponent';

class NoteDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      title: '',
      note: '',
      isEdit: false,
      displayEditLot: 'none',
      files: [],
      fileNames: [],
      newFiles: []
    };

    this.handleBack = this.handleBack.bind(this);
    this.showQRCode = this.showQRCode.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount() {
    this.name = this.props.match.params.name;
    this.id = this.props.match.params.id;
    firebase
      .database()
      .ref(this.name + '/' + this.id)
      .on('value', (snapshot) => {
        const noteObj = snapshot.val();
        localStorage.setItem('title', noteObj.title);
        localStorage.setItem('note', noteObj.note);
        localStorage.setItem('files', JSON.stringify(noteObj.urls));
        console.log('noteObj.urls :>> ', noteObj.urls);
        let fileListRaw = noteObj.urls;
        let fileList = [];
        if (fileListRaw && fileListRaw.length > 0) {
          let regex = /%2F(.*?)\?alt/;
          for (let i = 0; i < fileListRaw.length; i++) {
            let fileName = fileListRaw[i].match(regex);
            fileList.push(decodeURI(fileName[1]));
          }
        }

        this.setState({
          id: snapshot.key,
          title: noteObj.title,
          note: noteObj.note,
          files: noteObj.urls,
          fileNames: fileList,
          inputKey: 1,
        });
      });
  }

  handleBack() {
    let { history } = this.props;
    if (history) history.push('/' + this.name);
  }

  showQRCode() {
    // let qrStatus = this.state.displayEditLot;
    this.setState({ displayEditLot: 'block' });
  }

  onChangeHandler(evt, key) {
    this.setState({
      [key]: evt.target.value,
    });
  }

  handleEdit(title, note) {
    let newEdit = this.state.isEdit;
    this.setState({
      isEdit: !newEdit,
      note: note,
      title: title,
    });
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

  deleteFile(event) {
    let fileUrl = event.target.name;
    let newFiles = this.state.files.filter((e) => e !== fileUrl);
    firebase.database().ref(this.name).child(this.state.id).update({
      urls: newFiles,
    });
    this.setState({
      files: newFiles,
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
      newFiles: files,
    });
  }

  async handleUpload(e) {
    let self = this;
    e.preventDefault(); // prevent page refreshing
    const promises = [];
    let urls = [];
    if (this.state.newFiles && this.state.newFiles.length > 0) {
      this.state.newFiles.forEach((file) => {
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
            let oriUrl =
              localStorage.getItem('files') === 'undefined'
                ? []
                : JSON.parse(localStorage.getItem('files'));
            console.log('oriUrl :>> ', oriUrl);
            if (oriUrl && oriUrl.length >= 0) {
              if (urls.length === self.state.newFiles.length) {
                let fullUrls = oriUrl.concat(urls);
                console.log('fullUrls :>> ', fullUrls);
                firebase.database().ref(this.name).child(self.state.id).update({
                  urls: fullUrls,
                });
                self.setState({
                  files: fullUrls,
                  inputKey: Date.now(),
                });
                alert('Upload file(s) successfully!');
              }
            }
          }
        );
      });
      await Promise.all(promises)
        .then(() => {
          console.log('All files uploaded');
        })
        .catch((err) => {
          console.log(err.code);
          self.setState({
            inputKey: Date.now(),
          });
        });
    }
  }

  render() {
    const name = this.props.match.params.name;
    const id = this.props.match.params.id;

    return (
      <div>
        <button onClick={this.handleBack}>Back</button>
        <button onClick={this.showQRCode}>Show QRCode</button>
        <button
          onClick={() => this.handleEdit(this.state.title, this.state.note)}
        >
          Edit
        </button>
        <div className='form-group'>
          <label htmlFor='noteform-file'>Upload File</label>
          <input
            type='file'
            multiple
            key={this.state.inputKey}
            onChange={(e) => this.handleChangeFile(e)}
          />
          <button onClick={(e) => this.handleUpload(e)}>Upload</button>
        </div>
        {this.state.isEdit ? (
          <div>
            <p>
              <input
                type='text'
                value={this.state.title}
                onChange={(evt) => this.onChangeHandler(evt, 'title')}
              />
            </p>
            <p>
              <input
                type='text'
                value={this.state.note}
                onChange={(evt) => this.onChangeHandler(evt, 'note')}
              />
            </p>
            <div>
              <button
                disabled={
                  localStorage.getItem('title') === this.state.title &&
                  localStorage.getItem('note') === this.state.note
                    ? true
                    : false
                }
                onClick={() => this.handleUpdate(this.state.id)}
              >
                Save
              </button>
              <button onClick={this.handleCancel}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <p>{this.state.title}</p>
            <p>
              <Linkify>{this.state.note}</Linkify>
            </p>
          </div>
        )}

        {this.state.isEdit ? (
          <ul>
            {this.state.files &&
              this.state.files.length > 0 &&
              this.state.files.map((e, i) => {
                return (
                  <li key={i}>
                    <a href={e}>{this.state.fileNames[i]}</a>
                    <button
                      name={e}
                      style={{ marginLeft: '20px', cursor: 'pointer' }}
                      onClick={this.deleteFile}
                    >
                      x
                    </button>
                  </li>
                );
              })}
          </ul>
        ) : (
          <ul>
            {this.state.files &&
              this.state.files.length > 0 &&
              this.state.files.map((e, i) => {
                return (
                  <li key={i}>
                    {e ? (
                      <a href={e}>{this.state.fileNames[i]}</a>
                    ) : (
                      null
                    )}
                  </li>
                );
              })}
          </ul>
        )}

        <ModalComponent
          display={this.state.displayEditLot}
          setDisplay={(display) => {
            this.setState({ displayEditLot: display });
          }}
          title='QRCode of this note'
        >
          <QRCode
            id='qrcode'
            value={`${process.env.REACT_APP_HOSTNAME}/${name}/${id}`}
            size={290}
            level={'H'}
            includeMargin={true}
          />
        </ModalComponent>
      </div>
    );
  }
}

export default withRouter(NoteDetail);
