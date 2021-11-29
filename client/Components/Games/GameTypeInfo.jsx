import React from 'react';
import AlertPanel from '../Site/AlertPanel';

const GameTypeInfo = ({ gameType }) => {
    switch (gameType) {
        case 'beginner':
            return (
                <AlertPanel type='info'>
                    <strong>Beginner</strong> Playing in this category usually means you are
                    unfamiliar with the interface, and may take a long time to play your turns.
                    Basic game rule mistakes should be expected.
                </AlertPanel>
            );
        case 'casual':
            return (
                <AlertPanel type='info'>
                    <strong>Casual</strong> This category assumes you are familiar with the
                    interface and game to a basic level. Games should be informal and laid back.
                    Take-backs and the like would be expected to be permitted. Like you&quot;re
                    playing a friend. Bathroom breaks and distractions are to be expected.
                </AlertPanel>
            );
        case 'competitive':
            return (
                <AlertPanel type='info'>
                    <strong>Competitive</strong> A reasonable standard of play is to be expected, in
                    a tournament like setting. Prompt play with no excessive afking or rule errors.
                </AlertPanel>
            );
    }
};

export default GameTypeInfo;
