const Card = require('../../Card.js');

class FaustTheGreat extends Card {
    // Your opponent's keys cost +1 for each friendly creature with  on it.
    // Play: You may exalt a friendly creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: true,
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.exalt()
            }
        });
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(
                (player, context) =>
                    context.source.controller.cardsInPlay.filter(
                        (card) => card.type === 'creature' && card.hasToken('amber')
                    ).length
            )
        });
    }
}

FaustTheGreat.id = 'faust-the-great';

module.exports = FaustTheGreat;
