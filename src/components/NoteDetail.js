import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as firebase from 'firebase';
import QRCode from 'qrcode.react';
import Linkify from 'react-linkify';
import { API_HOST } from '../configs/configs';

class NoteDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      note: '',
      showQR: false,
    };

    this.handleBack = this.handleBack.bind(this);
    this.showQRCode = this.showQRCode.bind(this);
  }

  componentDidMount() {
    this.name = this.props.match.params.name;
    this.id = this.props.match.params.id;
    firebase
      .database()
      .ref(this.name + '/' + this.id)
      .on('value', (snapshot) => {
        const noteObj = snapshot.val();
        this.setState({
          title: noteObj.title,
          note: noteObj.note,
        });
      });
  }

  handleBack() {
    let { history } = this.props;
    if (history) history.push('/' + this.name);
  }

  showQRCode() {
    let qrStatus = this.state.showQR;
    this.setState({ showQR: !qrStatus });
  }

  render() {
    const name = this.props.match.params.name;
    const id = this.props.match.params.id;

    return (
      <div>
        <button onClick={this.handleBack}>Back</button>
        <button onClick={this.showQRCode}>Show QRCode</button>
        <p>{this.state.title}</p>
        <p><Linkify>{this.state.note}</Linkify></p>
        {this.state.showQR ? (
          <QRCode
            id='qrcode'
            value={`${API_HOST}/${name}/${id}`}
            size={290}
            level={'H'}
            includeMargin={true}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default withRouter(NoteDetail);
