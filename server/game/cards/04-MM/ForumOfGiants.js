const Card = require('../../Card.js');

class ForumOfGiants extends Card {
    // At the start of your turn, the player who controls the most powerful creature gains 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: (_, context) => context.player === this.game.activePlayer
            },
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                controller: 'any',
                numCards: 1,
                cardStat: (card) => card.power
            },
            gameAction: ability.actions.gainAmber((context) => ({
                target:
                    context.target && context.target.length > 0
                        ? context.target[0].controller
                        : null
            })),
            effect: 'make {1} gain 1 amber',
            effectArgs: (context) => [
                context.target && context.target.length > 0
                    ? context.target[0].controller
                    : 'no player'
            ]
        });
    }
}

ForumOfGiants.id = 'forum-of-giants';

module.exports = ForumOfGiants;
