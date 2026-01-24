import React from 'react';
import AlertPanel from '../Site/AlertPanel';

const GamePlaystyleInfo = ({ gamePlaystyle }) => {
    switch (gamePlaystyle) {
        case 'beginner':
            return (
                <AlertPanel type='info'>
                    <strong>Beginner:</strong> You are learning KeyForge and how to use TCO. Asking
                    for help, taking a long time to play, and basic rules mistakes are expected.
                </AlertPanel>
            );
        case 'casual':
            return (
                <AlertPanel type='info'>
                    <strong>Casual:</strong> An informal standard of play expected like in a kitchen
                    table setting. Asking for take-backs and table talk can be expected, like you
                    are playing with a friend.
                </AlertPanel>
            );
        case 'competitive':
            return (
                <AlertPanel type='info'>
                    <strong>Competitive:</strong> A rasonable standard of play like in a tournament
                    setting. Prompt play with no excessive AFKing or take backs on errors.
                </AlertPanel>
            );
        case 'uncharted-lands':
            return (
                <AlertPanel type='info'>
                    <strong>Uncharted Lands:</strong> This category is for games that don&apos;t use
                    standard tournament rules or formats. Examples include Unchained, Menagerie,
                    Martian Civil War, and potentially more.
                </AlertPanel>
            );
    }
};

export default GamePlaystyleInfo;
