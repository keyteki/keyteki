const Card = require('../../Card.js');

class FaustTheGreat extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.exalt()
            },
            effect: 'exalts {0}',
            effectArgs: context => context.player
        });
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(() =>
                this.controller.cardsInPlay.filter(card => card.type === 'creature' && card.hasToken('amber')).length)
        });
    }
}

FaustTheGreat.id = 'faust-the-great';

module.exports = FaustTheGreat;
