/**
 * @typedef {'canEditNews' | 
    'canManageUsers' | 
    'canManagePermissions' | 
    'canManageGames' | 
    'canManageNodes' |
    'canModerateChat' | 
    'canVerifyDecks' | 
    'canManageBanlist' | 
    'canManageMotd' | 
    'canManageTournaments' | 
    'isAdmin' | 
    'isContributor' | 
    'isSupporter' | 
    'isWinner'} Permission
 */

/**
 * @typedef User
 * @property {string} id The unique id of the user
 * @property {string} username The name of the user
 * @property {string} email The user's email address
 * @property {any} settings The user's settings
 * @property {any} permissioms The user's permissions
 * @property {boolean} verified Whether or not the user is verified
 * @property {boolean} enableGravatar Whether or not the user has gravatar enabled
 * @property {any} challonge The user's challonge data
 */

/**
 * @typedef {'normal' | 'sealed'| 'reversal' | 'adaptive-bo1'} GameFormat
 */

/**
 * @typedef {'casual' | 'beginner'| 'competitive' | 'adaptive-bo1'} GameType
 */

/**
 * @typedef PendingDeck
 * @property {string} [name] The name of the deck
 * @property {boolean} selected Whether or not a deck is selected
 * @property {string} [status] The validity status of the selected deck
 */

/**
 * @typedef Spectator
 * @property {string} id The spectators unique id
 * @property {string} name The name of the spectator
 */

/**
 * @typedef PendingPlayer
 * @property {PendingDeck} deck The deck this pplayer has selected
 * @property {string[]} houses The houses in player's deck ?!?!?
 * @property {string} id The player's unique id
 * @property {boolean} left Whether this player has left the game
 * @property {string} name The name of the player
 * @property {boolean} owner Whether or not this player is the owner of the game
 * @property {string} role The role this player has, used for colouring their name
 * @property {number} wins The number of wins this player has in this series of games
 */

/**
 * @typedef PendingGame
 * @property {boolean} adaptive Whether or not this game is adaptive
 * @property {boolean} allowSpectators Whether or not spectators are allowed to join
 * @property {any} challonge The challonge object
 * @property {Date} createdAt When the game was created
 * @property {GameFormat} gameFormat The format of the game
 * @property {boolean} gamePrivate Whether or not the game is private
 * @property {GameType} gameType The type of game
 * @property {string} id The game id guid
 * @property {any[]} messages The game chat messages
 * @property {boolean} muteSpectators Whether or not spectators are muted (unable to chat)
 * @property {string} name The name of the game
 * @property {boolean} needsPassword Whether or not this game needs a password to join
 * @property {string} node The game node this game is hosted on
 * @property {string} owner The owner(creator) of the game
 * @property {{[key: string]: PendingPlayer}} players The players in the game
 * @property {string} previousWinner The player who won the last game
 * @property {boolean} showHand Whether or not to show hands to spectators
 * @property {boolean} started Whether or not this game has started
 * @property {boolean} swap Whether or not this game has had a deck swap
 * @property {Spectator[]} spectators The users spectating the game
 * @property {boolean} useGameTimeLimit Whether or not this game has time limits enabled
 */
