// class Chat extends React.Component {
//   constructor(props) {
//     super(props);
//   }

// class ToggleBox extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // toggle box is closed initially
//       opened: false,
//     };
//     // http://egorsmirnov.me/2015/08/16/react-and-es6-part3.html
//     this.toggleBox = this.toggleBox.bind(this);
//   }
//
//   toggleBox() {
//     // check if box is currently opened
//     const { opened } = this.state;
//     this.setState({
//       // toggle value of `opened`
//       opened: !opened,
//     });
//   }
//
//   render() {
//     const { title, children } = this.props;
//     const { opened } = this.state;
//     return (
//       <div className="box">
//         <div className="boxTitle" onClick={this.toggleBox}>
//           {title}
//         </div>
//         {opened &&
//           <div className="boxContent">
//             {children}
//           </div>}
//       </div>
//     );
//   }
// }
//
// ReactDOM.render(
//   <ToggleBox title="Click me">
//     <div>Some content</div>
//   </ToggleBox>,
//   document.getElementById('root'),
// );
import React from 'react';
import ReactDOM from 'react-dom';
import ReactHtmlParser from 'react-html-parser';
import Chat from './icons/Chat.jsx';
import ChatContainer from './ChatContainer.jsx';

class ToggleBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // toggle box is closed initially
      opened: false,
    };
    // http://egorsmirnov.me/2015/08/16/react-and-es6-part3.html
    this.toggleBox = this.toggleBox.bind(this);
  }

  toggleBox() {
    // check if box is currently opened
    const { opened } = this.state;
    this.setState({
      // toggle value of `opened`
      opened: !opened,
    });
  }

  render() {
    const { title, children } = this.props;
    const { opened } = this.state;
    return (
      // <div className="box">
      <div>
        <div className="open-bot-icon" onClick={this.toggleBox}>
          <Chat />
        </div>
        {opened &&
          <div className="box-content">
            <ChatContainer />
          </div>}
      </div>
    );
  }
}

ReactDOM.render(
  <ToggleBox text="Click me">
    <div>Some content</div>
  </ToggleBox>,
  document.getElementById('root'),
);
export default ToggleBox;
