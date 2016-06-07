
const React = require('react');

const ChatTab = React.createClass({
    getInitialState: function () {
        return {
        };
    },

    renderMessage: function (message) {
        return (
            <div key={message.id}>
                {message.nick}:&nbsp;
                {message.body}
            </div>
        );
    },
    render: function () {
        return (
            <div className="tab">
                {this.props.messages.map(this.renderMessage)}
            </div>
        );
    },
});

module.exports = ChatTab;
