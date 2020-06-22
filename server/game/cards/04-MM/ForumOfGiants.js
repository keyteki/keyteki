const Card = require('../../Card.js');
const { sortBy } = require('../../../Array.js');

class ForumOfGiants extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === 'key' && context.player === this.game.activePlayer
            },
            // TODO: Check whether the active player should choose in the case of a tie, also make it not be random who gets it
            gameAction: ability.actions.gainAmber((context) => ({
                target:
                    context.game.creaturesInPlay.length > 1
                        ? sortBy(context.game.creaturesInPlay, (c) => -c.power)[0].controller
                        : context.source.controller
            }))
        });
    }
}

ForumOfGiants.id = 'forum-of-giants';

module.exports = ForumOfGiants;
