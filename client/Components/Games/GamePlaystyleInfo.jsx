import React from 'react';
import AlertPanel from '../Site/AlertPanel';

const GamePlaystyleInfo = ({ gamePlaystyle }) => {
    switch (gamePlaystyle) {
        case 'beginner':
            return (
                <AlertPanel type='info'>
                    <strong>Beginner:</strong> You are learning the game and interface, and may ask
                    for help or take a long time to play your turns. Basic rule mistakes and asking
                    for help is expected.
                </AlertPanel>
            );
        case 'casual':
            return (
                <AlertPanel type='info'>
                    <strong>Casual:</strong> You are familiar with the interface and game at a basic
                    level, similar to a kitchen table setting. Asking for take-backs and table talk
                    can be expected, like you are playing a friend.
                </AlertPanel>
            );
        case 'competitive':
            return (
                <AlertPanel type='info'>
                    <strong>Competitive:</strong> A reasonable standard of play, similar to a
                    tournament setting. Prompt play with no excessive AFKing or take backs on
                    errors.
                </AlertPanel>
            );
        case 'uncharted-lands':
            return (
                <AlertPanel type='info'>
                    <strong>Uncharted Lands:</strong> This category is for playing sets which are
                    not considered tournament-legal by GG.
                </AlertPanel>
            );
    }
};

export default GamePlaystyleInfo;
