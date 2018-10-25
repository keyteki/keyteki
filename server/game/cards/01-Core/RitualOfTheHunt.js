const Card = require('../../Card.js');

class RitualOfTheHunt extends Card {
    setupCardAbilities(ability) {
        this.omni({
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.forRemainderOfTurn({
                    effect: ability.effects.canUse(card => card.hasHouse('untamed') && card.type === 'creature')
                })
            ]
        });
    }
}

RitualOfTheHunt.id = 'ritual-of-the-hunt'; // This is a guess at what the id might be - please check it!!!

module.exports = RitualOfTheHunt;
