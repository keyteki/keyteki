const Card = require('../../Card.js');

class TirelessCrocag extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.opponent.creaturesInPlay.length === 0,
            gameAction: ability.actions.destroy({ target: this })
        });
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.cardCannot('reap'),
                ability.effects.canUse(card => card === this)
            ]
        });
        this.reaction({
            when: {
                onCardLeavesPlay: (event, context) => event.card.type === 'creature' && context.player.opponent.creaturesInPlay.length === 0
            },
            gameAction: ability.actions.destroy({ target: this })
        });
    }
}

TirelessCrocag.id = 'tireless-crocag';

module.exports = TirelessCrocag;
