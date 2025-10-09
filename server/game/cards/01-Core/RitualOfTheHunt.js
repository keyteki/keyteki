const Card = require('../../Card.js');

class RitualOfTheHunt extends Card {
    // Omni: Sacrifice Ritual of the Hunt. For the remainder of the turn, you may use friendly Untamed creatures.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.forRemainderOfTurn({
                    effect: ability.effects.canUse(
                        (card) => card.hasHouse('untamed') && card.type === 'creature'
                    )
                })
            ]
        });
    }
}

RitualOfTheHunt.id = 'ritual-of-the-hunt';

module.exports = RitualOfTheHunt;
