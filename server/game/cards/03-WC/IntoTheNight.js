const Card = require('../../Card.js');

class IntoTheNight extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'stop all non-Shadows creatures from fighting until the start of their next turn',
            gameAction: ability.actions.cardLastingEffect(context => ({
                duration: 'untilNextTurn',
                target: context.game.creaturesInPlay.filter(card => !card.hasHouse('shadows')),
                effect: ability.effects.cardCannot('fight')
            }))
        });
    }
}

IntoTheNight.id = 'into-the-night';

module.exports = IntoTheNight;
