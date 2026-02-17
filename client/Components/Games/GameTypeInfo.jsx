import React from 'react';

const GameTypeInfo = ({ gameType }) => {
    let title;
    let description;

    switch (gameType) {
        case 'beginner':
            title = 'Beginner';
            description =
                'Playing in this category usually means you are unfamiliar with the interface, and may take a long time to play your turns. Basic game rule mistakes should be expected.';
            break;
        case 'casual':
            title = 'Casual';
            description =
                "This category assumes you are familiar with the interface and game to a basic level. Games should be informal and laid back. Take-backs and the like would be expected to be permitted. Like you're playing a friend. Bathroom breaks and distractions are to be expected.";
            break;
        case 'competitive':
            title = 'Competitive';
            description =
                'A reasonable standard of play is to be expected, in a tournament like setting. Prompt play with no excessive afking or rule errors.';
            break;
        default:
            return null;
    }

    return (
        <div className='rounded-md border border-border/45 bg-surface-secondary/33 px-2 py-1 text-sm text-foreground/75 transition-colors duration-150 ease-out'>
            <span className='font-semibold text-foreground/88'>{title}</span>{' '}
            <span className='text-foreground/72'>{description}</span>
        </div>
    );
};

export default GameTypeInfo;
