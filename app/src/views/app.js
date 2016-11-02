
const React = require('react'),
      Setup = require('./setup.js'),
      Menu = require('./menu.js'),
      ChatTab = require('./chat_tab.js');

const App = React.createClass({
    getInitialState: function () {
        return {
            loaded: false,
            authenticated: false,

            tab: "chat",
            messages: [],

            streamer_username: "",
            bot_username: "",
            status: "",
            game: "",
        };
    },
    componentWillMount: function () {
        var credentials = this.getLocalCredentials();
        if (credentials !== null) {
            this.props.net.request("authenticate", credentials).then(
                this.handleAuthenticateSuccess,
                this.handleAuthenticateFailure,
            );
        }
    },

    // network events
    handleAuthenticateSuccess: function (payload) {
        this.setState({
            authenticated: true,
        });
        this.finishLoading();
    },
    handleAuthenticateFailure: function (error) {
        // TODO: handle failure
        console.log("got error while authenticating:", error);
    },
    handleUserDetailsSuccess: function (payload) {
        this.setState({
            streamer_username: payload.streamer_username,
            bot_username: payload.bot_username,
            status: payload.streamer_status,
            game: payload.streamer_game,
            loaded: true,
        });
    },
    handleUserDetailsFailure: function (error) {
        // TODO: handle failure
        console.log("got error while getting user details:", error);
    },
    handleChatMessage: function (payload, error) {
        var messages = this.state.messages;
        this.setState({
            messages: messages.concat([payload]),
        });
    },

    getLocalCredentials: function () {
        var username = this.props.localStorage.getItem("username"),
            password = this.props.localStorage.getItem("password");
        if (!username || !password) {
            return null;
        }
        return {
            username: username,
            password: password,
        };
    },
    finishLoading: function () {
        this.props.net.request("twitch-user-details", null).then(
            this.handleUserDetailsSuccess,
            this.handleUserDetailsFailure,
        );
        this.props.net.request("bttv-emoji").then((payload) => {
            emoji.initBTTV(payload);
        }, (error) => {
            console.log("got error while requesting BTTV emoji:", error);
        })

        this.props.net.listeners.cmd("chat-message", this.handleChatMessage);
        this.props.net.send({
            cmd: "twitch-stream-messages",
        });
    },

    renderTab: function () {
        switch (this.state.tab) {
        case "chat":
            return <ChatTab streamer_username={this.state.streamer_username}
                            bot_username={this.state.bot_username}
                            status={this.state.status}
                            game={this.state.game}
                            messages={this.state.messages}
                            net={this.props.net}
                            key="chat-tab" />;
        default:
            return <div className="tab">Content for {this.state.tab} tab!</div>;
        }
    },
    renderLoading: function () {
        return <div id="loading">Loading</div>;
    },
    renderSetup: function () {
        return <Setup parent={this} net={this.props.net} />;
    },
    renderNormal: function () {
        return [
            <Menu parent={this} selected={this.state.tab} key="menu" />,
            this.renderTab()
        ];
    },
    renderApp: function () {
        if (!this.state.loaded) {
            return this.renderLoading();
        }
        if (!this.state.authenticated) {
            return this.renderSetup();
        }
        return this.renderNormal();
    },
    render: function () {
        return <div id="app">
            {this.renderApp()}
        </div>;
    },
});

module.exports = App;
