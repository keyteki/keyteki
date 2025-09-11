const Card = require('../../Card.js');

class Incensed extends Card {
    // Play: For the remainder of the turn, each friendly creature
    // gains, “After Fight: Gain 1A.”
    setupCardAbilities(ability) {
        this.play({
            effect:
                "give each friendly creature 'After Fight: Gain 1 amber' for the remainder of the turn",
            gameAction: ability.actions.forRemainderOfTurn({
                match: (card) => card.type === 'creature',
                effect: ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.gainAmber()
                })
            })
        });
    }
}

Incensed.id = 'incensed';

module.exports = Incensed;
