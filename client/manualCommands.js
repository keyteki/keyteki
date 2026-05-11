// Client-side list of manual mode chat commands, used by the How To Play
// page to render the documentation list with i18n.
//
// Server-side wiring of these commands lives in server/game/chatcommands.js.
// The server-side `/help` command sources its plain-text list from
// server/game/manualCommands.js. Keep the two lists in sync when adding,
// renaming, or removing commands.
//
// Order: alphabetical by command name. New entries should be inserted in
// the correct alphabetical position.
const manualCommands = [
    {
        usage: '/active-house x',
        i18nKey: 'howtoplay.cmd.activehouse',
        description: 'Change your active house to x'
    },
    {
        usage: '/add-card [hand|deck] x',
        i18nKey: 'howtoplay.cmd.addcard',
        description: 'Add a card by name to your hand or top of deck'
    },
    {
        usage: '/cancel-prompt',
        i18nKey: 'howtoplay.cmd.cancelprompt',
        description:
            "Clear the current prompt and resume the game flow. Use with caution and only when the prompt is 'stuck' and you are unable to continue"
    },
    {
        usage: '/discard x',
        i18nKey: 'howtoplay.cmd.discard',
        description: 'Discards x cards randomly from your hand'
    },
    {
        usage: '/discard-top-of-deck x',
        i18nKey: 'howtoplay.cmd.discardtopofdeck',
        description: 'Discards x cards from the top of your deck'
    },
    {
        usage: '/draw x',
        i18nKey: 'howtoplay.cmd.draw',
        description: 'Draws x cards from your deck to your hand'
    },
    {
        usage: '/first-player x',
        i18nKey: 'howtoplay.cmd.firstplayer',
        description: 'Before starting hands are drawn, change the first player'
    },
    {
        usage: '/forge [color]',
        i18nKey: 'howtoplay.cmd.forge',
        description: 'Forge a key (optionally specify color)'
    },
    {
        usage: '/help',
        i18nKey: 'howtoplay.cmd.help',
        description: 'Show the list of manual mode commands in the game log'
    },
    {
        usage: '/manual',
        i18nKey: 'howtoplay.cmd.manual',
        description: 'Activate or deactivate manual mode'
    },
    {
        usage: '/mute-spectators',
        i18nKey: 'howtoplay.cmd.mutespectators',
        description: 'Toggle muting spectators'
    },
    {
        usage: '/rematch',
        i18nKey: 'howtoplay.cmd.rematch',
        description: 'Start over a new game with the current opponent'
    },
    {
        usage: '/reveal-hand',
        i18nKey: 'howtoplay.cmd.revealhand',
        description: 'Reveal your hand to the game log'
    },
    {
        usage: '/shuffle',
        i18nKey: 'howtoplay.cmd.shuffle',
        description: 'Shuffle your deck'
    },
    {
        usage: '/tide x',
        i18nKey: 'howtoplay.cmd.tide',
        description: 'Change the tide to level x (high, low or neutral)'
    },
    {
        usage: '/token x y',
        i18nKey: 'howtoplay.cmd.token',
        description: 'Choose a card and change the number of tokens of type x to y'
    },
    {
        usage: '/token-creature',
        i18nKey: 'howtoplay.cmd.tokencreature',
        description: 'Make a token creature with the top card of your deck'
    },
    {
        usage: '/unforge [color]',
        i18nKey: 'howtoplay.cmd.unforge',
        description: 'Unforge a key (optionally specify color)'
    }
];

export default manualCommands;
