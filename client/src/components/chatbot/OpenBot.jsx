import React from 'react';
import ReactDOM from 'react-dom';
import ReactHtmlParser from 'react-html-parser';
import ChatIcon from './icons/ChatIcon.jsx';
import ChatContainer from './ChatContainer.jsx';
import Header from './Header.jsx';
import Chatbar from './Chatbar.jsx';

const BotBox = ({ visible }) =>
  <div id="bot" className={visible ? 'slideIn' : 'slideOut'}>
    <ChatContainer />
  </div>;

// class NavigationBar extends React.Component = ({ visible }) =>
//   <div id="navbar" className={visible ? 'slideIn' : 'slideOut'}>
//     <ChatContainer />
//   </div>;

class OpenBot extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = { visible: false };
  }

  handleClick() {
    this.setState(prev => ({ visible: !prev.visible }));
  }

  render() {
    return (
      <div>
        <div className="chat-icon" onClick={this.handleClick}>
          {this.state.visible
            ? 'Hide bot'
            : /* click to open icon*/ <svg
              fill="#7fcde5"
              height="36"
              viewBox="0 0 24 24"
              width="36"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              <path d="M0 0h24v24H0z" fill="none" />
            </svg>}
          {/* svg for chat icon*/}
        </div>
        <BotBox visible={this.state.visible} />
      </div>
    );
  }
}

// ReactDOM.render(<OpenBot />, document.getElementById('root'));
export default OpenBot;
