// Server-side list of manual mode chat commands, used by the in-game
// `/help` command to print the available commands to the game log.
//
// The client-side How To Play documentation has its own copy of this list
// at client/manualCommands.js (with i18n keys). Keep the two lists in sync
// when adding, renaming, or removing commands.
//
// Order: alphabetical by command name. New entries should be inserted in
// the correct alphabetical position.
module.exports = [
    { usage: '/active-house x', description: 'Change your active house to x' },
    {
        usage: '/add-card [hand|deck] x',
        description: 'Add a card by name to your hand or top of deck'
    },
    {
        usage: '/cancel-prompt',
        description:
            "Clear the current prompt and resume the game flow. Use with caution and only when the prompt is 'stuck' and you are unable to continue"
    },
    { usage: '/discard x', description: 'Discards x cards randomly from your hand' },
    {
        usage: '/discard-top-of-deck x',
        description: 'Discards x cards from the top of your deck'
    },
    { usage: '/draw x', description: 'Draws x cards from your deck to your hand' },
    {
        usage: '/first-player x',
        description: 'Before starting hands are drawn, change the first player'
    },
    { usage: '/forge [color]', description: 'Forge a key (optionally specify color)' },
    { usage: '/help', description: 'Show the list of manual mode commands in the game log' },
    { usage: '/manual', description: 'Activate or deactivate manual mode' },
    { usage: '/mute-spectators', description: 'Toggle muting spectators' },
    { usage: '/rematch', description: 'Start over a new game with the current opponent' },
    { usage: '/reveal-hand', description: 'Reveal your hand to the game log' },
    { usage: '/shuffle', description: 'Shuffle your deck' },
    { usage: '/tide x', description: 'Change the tide to level x (high, low or neutral)' },
    {
        usage: '/token x y',
        description: 'Choose a card and change the number of tokens of type x to y'
    },
    {
        usage: '/token-creature',
        description: 'Make a token creature with the top card of your deck'
    },
    { usage: '/unforge [color]', description: 'Unforge a key (optionally specify color)' }
];
