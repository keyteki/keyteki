/* eslint react/display-name: 0 react/no-multi-comp: 0 */

import React from 'react';
import Login from './pages/LoginContainer';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import Decks from './pages/Decks';
//import Matches from './pages/Matches';
import ImportDeck from './Components/Decks/ImportDeck';
import HowToPlay from './pages/HowToPlay';
import About from './pages/About';
import Security from './pages/Security.jsx';
import Activation from './pages/Activation';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserAdmin from './pages/UserAdmin';
import Profile from './pages/Profile';
import NewsAdmin from './pages/NewsAdmin';
import MotdAdmin from './pages/MotdAdmin';
import GameLobby from './Components/Games/GameLobby';
import TournamentLobby from './Components/Games/TournamentLobby';
import GameBoard from './Components/GameBoard/GameBoard.jsx';
import BlockList from './pages/BlockList';
import NodesAdmin from './pages/NodesAdmin';
import Privacy from './pages/Privacy';
import BanlistAdmin from './pages/BanlistAdmin';
import Patreon from './pages/Patreon';

const routes = [
    { path: '/', action: () => <Lobby key='lobby' /> },
    { path: '/about', action: () => <About key='about' /> },
    {
        path: '/activation',
        action: (context) => (
            <Activation key='activation' id={context.params.id} token={context.params.token} />
        )
    },
    { path: '/blocklist', action: () => <BlockList key='blocklist' /> },
    { path: '/decks', action: () => <Decks key='decks' /> },
    { path: '/decks/import', action: () => <ImportDeck key='importDecks' /> },
    { path: '/forgot', action: () => <ForgotPassword key='forgotpassword' /> },
    { path: '/how-to-play', action: () => <HowToPlay key='howtoplay' /> },
    { path: '/login', action: () => <Login key='login' /> },
    { path: '/logout', action: () => <Logout key='logout' /> },
    //{ path: '/matches', action: () => <Matches key='matches' /> },
    { path: '/news', action: () => <NewsAdmin key='newsadmin' />, permission: 'canEditNews' },
    {
        path: '/play',
        action: (context) =>
            context.currentGame && context.currentGame.started ? (
                <GameBoard key='gameboard' />
            ) : (
                <GameLobby key='gamelobby' gameId={context.params.gameId} />
            )
    },
    { path: '/profile', action: () => <Profile key='profile' /> },
    { path: '/register', action: () => <Register key='register' /> },
    {
        path: '/reset-password',
        action: (context) => (
            <ResetPassword
                key='resetpassword'
                id={context.params.id}
                token={context.params.token}
            />
        )
    },
    {
        path: '/tournamentlobby',
        action: () => <TournamentLobby key='tournamentlobby' />,
        permission: 'canManageTournaments'
    },
    { path: '/security', action: () => <Security key='security' /> },
    { path: '/users', action: () => <UserAdmin key='useradmin' />, permission: 'canManageUsers' },
    { path: '/nodes', action: () => <NodesAdmin key='nodesadmin' />, permission: 'canManageNodes' },
    { path: '/privacy', action: () => <Privacy key='privacy' /> },
    {
        path: '/banlist',
        action: () => <BanlistAdmin key='banlist' permission='canManageBanlist' />
    },
    {
        path: '/admin/motd',
        action: () => <MotdAdmin key='motdadmin' />,
        permission: 'canManageMotd'
    },
    { path: '/patreon', action: (context) => <Patreon code={context.params.code} /> }
];

export default routes;
