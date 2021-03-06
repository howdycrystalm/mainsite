import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import ImageViewer from './ImageViewer.jsx';
// const opn = require('opn');

class ChatBubble extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let className = 'blue-A bot-bubble-left';

    if (this.props.type === 'button') {
      className = ' button-blue-B chat-button-H';
      return (
        // allows user bubble and bot bubble to be on two different lines because we're wrapping in div className=bubble-breaker

        <div className={className} onClick={this.props.onClick.bind(this)}>
          {ReactHtmlParser(this.props.message)}
        </div>
      );
    } else if (this.props.type === 'image') {
      // className = 'rcorner';
      // console.log(this.props.message);
      // const attr = JSON.parse(this.props.message);
      return <ImageViewer src={this.props.message.src} alt={this.props.message.alt} />;
    } else if (this.props.type === 'map') {
      return (
        <div>
          <iframe className="map-S" src={this.props.message.src} name={this.props.message.name} />
        </div>
      );
    } else if (this.props.type === 'table') {
      console.log('executed');
      return (
        <div>
          <table onClick={this.props.onClick.bind(this)}>
            <thead>
              <tr>
                <th>
                  {'Company Name'}
                </th>
                <th>
                  {'Entity Number'}
                </th>
                <th>
                  {'Agent of Service'}
                </th>
              </tr>
            </thead>
            <tbody>
              {this.props.message.table.map((row, i) =>
                <tr key={i}>
                  <td>
                    {row.companyName}
                  </td>
                  <td>
                    {row.entityNum}
                  </td>
                  <td>
                    {row.agentOfService}
                  </td>
                </tr>,
              )}
            </tbody>
          </table>
        </div>
      );
    } else if (this.props.isBot === false) {
      className = ' user-J user-bubble-right'; // using '=' instead of '+=' seperates blue chat-bubble from orange user-bubble-right
      return (
        // allows user bubble and bot bubble to be on two different lines because we're wrapping in div className=bubble-breaker
        <div className="bubble-breaker">
          <div className={className}>
            {ReactHtmlParser(this.props.message)}
          </div>
        </div>
      );
    }

    return (
      <div className={className} /* onClick={this.props.onClick}*/>
        {ReactHtmlParser(this.props.message)}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  // controls buttons onclick function in bot response
  onClick(event) {
    // onClick on table can't use opn in frontend, has to transmit to backend.
    console.log('EVENT TYPE: ', event.currentTarget.nodeName);
    if (event.currentTarget.nodeName === 'TABLE') {
      console.log('URL: ', this.props.message.url);
      axios.post('/api/chat/message', { url: this.props.message.url }).then((response) => {
        dispatch({
          type: 'CHAT_ADD_MESSAGE',
          payload: {
            message: response.data.speech,
            type: 'text',
            isBot: true,
          },
        });
      });
      return;
    }
    // onClick on buttons
    const data = { message: this.props.message, type: this.props.type, isBot: this.props.isBot };
    console.log('SESSIONID: ', this.props.sessionId);
    axios
      .post('/api/chat/message', { payload: data, id: this.props.sessionId }) // redux way of saying once we send a POST request to server, then if we receive a response(Promise) from server
      .then((response) => {
        console.log('Response:', response);
        // response = JSON.parse(response);

        if (response.status === 200) {
          // axios.response.data, get speech from api.ai
          const msg = response.data.result.fulfillment.speech;

          dispatch({
            type: 'CHAT_ADD_MESSAGE',
            payload: {
              message: msg,
              type: 'text',
              isBot: true,
            },
          });
          // if there's a custom payload attached to api.ai response
          let customPayload;
          if (!response.data.result.fulfillment.data) {
            const messages = response.data.result.fulfillment.messages;
            console.log('Messages:', messages);
            if (messages.length > 1 && messages[1].type == 4) {
              // buttons in payload
              if (messages[1].payload.buttons) {
                // get custom payload from api.ai
                // console.log("buttons:", response.data.messages[1].payload.buttons);
                customPayload = messages[1].payload.buttons;
                customPayload.forEach((btn) => {
                  dispatch({
                    type: 'CHAT_ADD_MESSAGE',
                    payload: {
                      message: btn,
                      type: 'button',
                      isBot: true,
                    },
                  });
                });
              }
              // if image in payload
              if (messages[1].payload.image) {
                customPayload = messages[1].payload.image;
                dispatch({
                  type: 'CHAT_ADD_MESSAGE',
                  payload: {
                    message: customPayload,
                    type: 'image',
                    isBot: true,
                  },
                });
              }
              // if map in payload
              if (messages[1].payload.map) {
                customPayload = messages[1].payload.map;
                dispatch({
                  type: 'CHAT_ADD_MESSAGE',
                  payload: {
                    message: customPayload,
                    type: 'map',
                    isBot: true,
                  },
                });
              }
            }
          } else {
            const data = response.data.result.fulfillment.data;
            console.log('DATA: ', data);
            if (data.buttons) {
              customPayload = data.buttons;
              customPayload.forEach((btn) => {
                dispatch({
                  type: 'CHAT_ADD_MESSAGE',
                  payload: {
                    message: btn,
                    type: 'button',
                    isBot: true,
                  },
                });
              });
            }
            if (data.image) {
              customPayload = data.image;
              dispatch({
                type: 'CHAT_ADD_MESSAGE',
                payload: {
                  message: customPayload,
                  type: 'image',
                  isBot: true,
                },
              });
            }
            if (data.map) {
              customPayload = data.map;
              dispatch({
                type: 'CHAT_ADD_MESSAGE',
                payload: {
                  message: customPayload,
                  type: 'map',
                  isBot: true,
                },
              });
            }

            if (data.table) {
              customPayload = data;
              console.log('CUSTOMPAYLOAD', customPayload);
              dispatch({
                type: 'CHAT_ADD_MESSAGE',
                payload: {
                  message: customPayload,
                  type: 'table',
                  isBot: true,
                },
              });
            }
          }
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  },
});

export default connect(null, mapDispatchToProps)(ChatBubble);
