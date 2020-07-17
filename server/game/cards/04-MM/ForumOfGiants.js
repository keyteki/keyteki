const Card = require('../../Card.js');

class ForumOfGiants extends Card {
    getMostPowerfulCreatureControllers(context) {
        let controllers = [];
        let max = -1;
        for (let creature of context.game.creaturesInPlay) {
            if (creature.power > max) {
                max = creature.power;
                controllers = [creature.controller];
            } else if (
                creature.power === max &&
                controllers.length < 2 &&
                !controllers.includes(creature.controller)
            ) {
                controllers.push(creature.controller);
            }
        }
        return controllers;
    }
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event, context) =>
                    event.phase === 'key' && context.player === this.game.activePlayer
            },
            effect: 'make {1} gain 1 amber',
            effectArgs: (context) => [this.getMostPowerfulCreatureControllers(context)],
            gameAction: ability.actions.gainAmber((context) => ({
                target: this.getMostPowerfulCreatureControllers(context)
            }))
        });
    }
}

ForumOfGiants.id = 'forum-of-giants';

module.exports = ForumOfGiants;
