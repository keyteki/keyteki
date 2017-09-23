import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import moment from 'moment';

import * as actions from './actions';
import Avatar from './Avatar.jsx';
import News from './SiteComponents/News.jsx';
import AlertPanel from './SiteComponents/AlertPanel.jsx';

class InnerLobby extends React.Component {
    constructor() {
        super();

        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.state = {
            canScroll: true,
            message: ''
        };
    }

    componentDidMount() {
        this.props.loadNews({ limit: 3 });
    }

    componentDidUpdate() {
        if(this.state.canScroll) {
            $(this.refs.messages).scrollTop(999999);
        }
    }

    sendMessage() {
        if(this.state.message === '') {
            return;
        }

        this.props.socket.emit('lobbychat', this.state.message);

        this.setState({ message: '' });
    }

    onKeyPress(event) {
        if(event.key === 'Enter') {
            this.sendMessage();

            event.preventDefault();
        }
    }

    onSendClick(event) {
        event.preventDefault();

        this.sendMessage();
    }

    onChange(event) {
        this.setState({ message: event.target.value });
    }

    onScroll() {
        var messages = this.refs.messages;

        setTimeout(() => {
            if(messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                this.setState({ canScroll: true });
            } else {
                this.setState({ canScroll: false });
            }
        }, 500);
    }

    onBurgerClick() {
        this.setState({ showUsers: !this.state.showUsers });
    }

    getMessages() {
        let groupedMessages = {};
        let index = 0;
        let today = moment();
        let yesterday = moment().add(-1, 'days');
        let lastUser;
        let currentGroup = 0;

        _.each(this.props.messages, message => {
            if(!message.user) {
                return;
            }

            let formattedTime = moment(message.time).format('YYYYMMDDHHmm');
            if(lastUser && message.user && lastUser !== message.user.username) {
                currentGroup++;
            }

            let key = message.user.username + formattedTime + currentGroup;

            if(!groupedMessages[key]) {
                groupedMessages[key] = [];
            }

            groupedMessages[key].push(message);

            lastUser = message.user.username;
        });

        return _.map(groupedMessages, messages => {
            let timestamp = '';
            let firstMessage = _.first(messages);

            if(!firstMessage.user) {
                return;
            }

            if(today.isSame(firstMessage.time, 'd')) {
                timestamp = moment(firstMessage.time).format('H:mm');
            } else if(yesterday.isSame(firstMessage.time, 'd')) {
                timestamp = 'yesterday ' + moment(firstMessage.time).format('H:mm');
            } else {
                timestamp = moment(firstMessage.time).format('MMM Do H:mm');
            }

            let renderedMessages = _.map(messages, message => {
                if(!message.user) {
                    return;
                }
                return (<div className='lobby-message'>{ message.message }</div>);
            });

            return (
                <div key={ timestamp + firstMessage.user.username + (index++).toString() }>
                    <Avatar emailHash={ firstMessage.user.emailHash } float forceDefault={ firstMessage.user.noAvatar } />
                    <span className='username'>{ firstMessage.user.username }</span><span>{ timestamp }</span>
                    { renderedMessages }
                </div>
            );
        });
    }

    render() {
        let messages = this.getMessages();

        var users = _.map(this.props.users, user => {
            return (
                <div key={ user.name }>
                    <Avatar emailHash={ user.emailHash } forceDefault={ user.noAvatar } />
                    <span>{ user.name }</span>
                </div>
            );
        });

        return (
            <div>
                { this.props.bannerNotice ? <AlertPanel message={ this.props.bannerNotice } type='error' /> : null }
                <AlertPanel type='info' message='Latest Site News'>
                    { this.props.loading ? <div>News loading...</div> : null }
                    <News news={ this.props.news } />
                </AlertPanel>
                <div className='row'>
                    <span className='col-sm-9 text-center'><h1>Play Legend of the Five Rings LCG</h1></span>
                    <span className='col-sm-3 hidden-xs'><h3>{ 'Online Users (' + users.length + ')' }</h3></span>
                </div>
                <div className='row'>
                    <div className='lobby-chat col-sm-9'>
                        <div className='panel lobby-messages' ref='messages' onScroll={ this.onScroll }>
                            { messages }
                        </div>
                    </div>
                    <div className='panel user-list col-sm-3 hidden-xs'>
                        { users }
                    </div>
                </div>
                <div className='row'>
                    <form className='form form-hozitontal'>
                        <div className='form-group'>
                            <div className='chat-box col-sm-5 col-xs-9'>
                                <input className='form-control' type='text' placeholder='Chat...' value={ this.state.message }
                                    onKeyPress={ this.onKeyPress } onChange={ this.onChange } />
                            </div>
                            <button type='button' className='btn btn-primary col-sm-1 col-xs-2' onClick={ this.onSendClick }>Send</button>
                        </div>
                    </form>
                </div>
            </div>);
    }
}

InnerLobby.displayName = 'Lobby';
InnerLobby.propTypes = {
    bannerNotice: React.PropTypes.string,
    fetchNews: React.PropTypes.func,
    loadNews: React.PropTypes.func,
    loading: React.PropTypes.bool,
    messages: React.PropTypes.array,
    news: React.PropTypes.array,
    socket: React.PropTypes.object,
    users: React.PropTypes.array
};

function mapStateToProps(state) {
    return {
        bannerNotice: state.chat.notice,
        loading: state.api.loading,
        messages: state.chat.messages,
        news: state.news.news,
        newsLoading: state.news.newsLoading,
        socket: state.socket.socket,
        users: state.games.users
    };
}

const Lobby = connect(mapStateToProps, actions, null)(InnerLobby);

export default Lobby;
