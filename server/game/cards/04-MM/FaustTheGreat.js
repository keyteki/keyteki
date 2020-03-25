const Card = require('../../Card.js');

class FaustTheGreat extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: true,
                activePromptTitle: 'Choose a creature to exalt',
                cardType: 'creature',
                gameAction: ability.actions.exalt()
            }
        });
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(this.controller.cardsInPlay.filter(card => card.type === 'creature' && card.hasToken('amber')).length)
        });
    }
}

FaustTheGreat.id = 'faust-the-great';

module.exports = FaustTheGreat;
