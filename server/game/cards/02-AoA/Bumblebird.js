const Card = require('../../Card.js');

class Bumblebird extends Card {
    // Alpha. (You can only play this card before doing anything else this step.)
    // Play: Put two +1 power counters on each other friendly Untamed creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'add 1 power counter to each other friendly untamed creature',
            gameAction: ability.actions.addPowerCounter((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) =>
                        card !== context.source &&
                        card.hasHouse('untamed') &&
                        card.controller === context.source.controller &&
                        card.type === 'creature'
                ),
                amount: 2
            }))
        });
    }
}

Bumblebird.id = 'bumblebird';

module.exports = Bumblebird;
