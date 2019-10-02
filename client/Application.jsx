import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { connect } from 'react-redux';

import ErrorBoundary from './Components/Site/ErrorBoundary';
import NavBar from './Components/Site/NavBar';
import Router from './Router';
import { tryParseJSON } from './util';
import AlertPanel from './Components/Site/AlertPanel';
import * as actions from './actions';

class Application extends React.Component {
    constructor(props) {
        super(props);

        this.router = new Router();

        this.state = {
        };
    }

    componentWillMount() {
        if(!localStorage) {
            this.setState({ incompatibleBrowser: true });
        } else {
            try {
                let token = localStorage.getItem('token');
                let refreshToken = localStorage.getItem('refreshToken');
                if(refreshToken) {
                    const parsedToken = tryParseJSON(refreshToken);
                    if(parsedToken) {
                        this.props.setAuthTokens(token, parsedToken);
                        this.props.authenticate();
                    }
                }
            } catch(error) {
                this.setState({ cannotLoad: true });
            }
        }

        this.props.loadCards();
        this.props.loadFactions();

        $(document).ajaxError((event, xhr) => {
            if(xhr.status === 403) {
                this.props.navigate('/unauth');
            }
        });

        this.props.connectLobby();
    }

    componentDidUpdate() {
        if(!this.props.currentGame) {
            this.props.setContextMenu([]);
        }
    }

    render() {
        let gameBoardVisible = this.props.currentGame && this.props.currentGame.started && this.props.path === '/play';

        let component = this.router.resolvePath({
            pathname: this.props.path,
            user: this.props.user,
            currentGame: this.props.currentGame
        });

        if(this.state.incompatibleBrowser) {
            component = <AlertPanel type='error' message='Your browser does not provide the required functionality for this site to work.  Please upgrade your browser.  The site works best with a recet version of Chrome, Safari or Firefox' />;
        } else if(this.state.cannotLoad) {
            component = <AlertPanel type='error' message='This site requires the ability to store cookies and local site data to function.  Please enable these features to use the site.' />;
        }

        let backgroundClass = 'bg';
        if(gameBoardVisible && this.props.user) {
            switch(this.props.user.settings.background) {
                case 'Brobnar':
                    backgroundClass += ' bg-board-brobnar';
                    break;
                case 'Dis':
                    backgroundClass += ' bg-board-dis';
                    break;
                case 'Logos':
                    backgroundClass += ' bg-board-logos';
                    break;
                case 'Mars':
                    backgroundClass += ' bg-board-mars';
                    break;
                case 'Sanctum':
                    backgroundClass += ' bg-board-sanctum';
                    break;
                case 'Shadows':
                    backgroundClass += ' bg-board-shadows';
                    break;
                case 'Untamed':
                    backgroundClass += ' bg-board-untamed';
                    break;
                default:
                    backgroundClass = '';
                    break;
            }
        }

        return (<div className={ backgroundClass }>
            <NavBar title='The Crucible Online' />
            <div className='wrapper'>
                <div className='container content'>
                    <ErrorBoundary navigate={ this.props.navigate } errorPath={ this.props.path } message={ 'We\'re sorry - something\'s gone wrong.' }>
                        { component }
                    </ErrorBoundary>
                </div>
            </div>
            <div className='keyforge-font' style={ {zIndex: -999} }>.</div>
        </div>);
    }
}

Application.displayName = 'Application';
Application.propTypes = {
    authenticate: PropTypes.func,
    connectLobby: PropTypes.func,
    currentGame: PropTypes.object,
    loadCards: PropTypes.func,
    loadFactions: PropTypes.func,
    loadPacks: PropTypes.func,
    loadRestrictedList: PropTypes.func,
    navigate: PropTypes.func,
    path: PropTypes.string,
    setAuthTokens: PropTypes.func,
    setContextMenu: PropTypes.func,
    token: PropTypes.string,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        currentGame: state.lobby.currentGame,
        path: state.navigation.path,
        token: state.account.token,
        user: state.account.user
    };
}

export default connect(mapStateToProps, actions)(Application);
