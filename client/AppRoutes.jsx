import React from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';

import About from './pages/About';
import Activation from './pages/Activation';
import AllianceBuilderPage from './pages/AllianceBuilder';
import BanlistAdmin from './pages/BanlistAdmin';
import BlockList from './pages/BlockList';
import Decks from './pages/Decks';
import ForgotPassword from './pages/ForgotPassword';
import HowToPlay from './pages/HowToPlay';
import Lobby from './pages/Lobby';
import Login from './pages/LoginContainer';
import Logout from './pages/Logout';
import MotdAdmin from './pages/MotdAdmin';
import NewsAdmin from './pages/NewsAdmin';
import NodesAdmin from './pages/NodesAdmin';
import NotFound from './pages/NotFound';
import Patreon from './pages/Patreon';
import Privacy from './pages/Privacy';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Security from './pages/Security.jsx';
import TournamentLobby from './Components/Games/TournamentLobby';
import Unauthorised from './pages/Unauthorised';
import UserAdmin from './pages/UserAdmin';
import ImportDeck from './Components/Decks/ImportDeck';
import GameLobby from './Components/Games/GameLobby';
import GameBoard from './Components/GameBoard/GameBoard.jsx';

const AppRoutes = ({ currentGame, user }) => {
    const [searchParams] = useSearchParams();
    const getParam = (key) => searchParams.get(key) || undefined;

    const requirePermission = (permission, element) => {
        if (!permission) {
            return element;
        }

        if (!user || !user.permissions?.[permission]) {
            return <Unauthorised />;
        }

        return element;
    };

    return (
        <Routes>
            <Route path='/' element={<Lobby />} />
            <Route path='/about' element={<About />} />
            <Route
                path='/activation'
                element={<Activation id={getParam('id')} token={getParam('token')} />}
            />
            <Route path='/blocklist' element={<BlockList />} />
            <Route path='/decks' element={<Decks />} />
            <Route path='/decks/import' element={<ImportDeck />} />
            <Route path='/decks/alliance' element={<AllianceBuilderPage />} />
            <Route path='/forgot' element={<ForgotPassword />} />
            <Route path='/how-to-play' element={<HowToPlay />} />
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/news' element={requirePermission('canEditNews', <NewsAdmin />)} />
            <Route
                path='/play'
                element={
                    currentGame?.started ? <GameBoard /> : <GameLobby gameId={getParam('gameId')} />
                }
            />
            <Route path='/profile' element={<Profile />} />
            <Route path='/register' element={<Register />} />
            <Route
                path='/reset-password'
                element={<ResetPassword id={getParam('id')} token={getParam('token')} />}
            />
            <Route
                path='/tournamentlobby'
                element={requirePermission('canManageTournaments', <TournamentLobby />)}
            />
            <Route path='/security' element={<Security />} />
            <Route path='/users' element={requirePermission('canManageUsers', <UserAdmin />)} />
            <Route path='/nodes' element={requirePermission('canManageNodes', <NodesAdmin />)} />
            <Route path='/privacy' element={<Privacy />} />
            <Route
                path='/banlist'
                element={requirePermission(
                    'canManageBanlist',
                    <BanlistAdmin permission='canManageBanlist' />
                )}
            />
            <Route path='/admin/motd' element={requirePermission('canManageMotd', <MotdAdmin />)} />
            <Route path='/patreon' element={<Patreon code={getParam('code')} />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
