const Card = require('../../Card.js');

class CameBackWrong extends Card {
    // Play: Play a creature from your discard pile and attach Came
    // Back Wrong to it as an upgrade with the text "This creature
    // gets -2 power and gains poison."
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'discard',
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.playCard(),
                    ability.actions.attach({ upgrade: this }),
                    ability.actions.cardLastingEffect((context) => ({
                        target: context.source,
                        targetLocation: 'play area',
                        duration: 'lastingEffect',
                        effect: ability.effects.changeType('upgrade')
                    }))
                ])
            }
        });

        this.whileAttached({
            effect: [ability.effects.addKeyword({ poison: 1 }), ability.effects.modifyPower(-2)]
        });
    }

    canAttach(card, context) {
        return card && card.getType() === 'creature' && context.source.location === 'being played';
    }
}

CameBackWrong.id = 'came-back-wrong';

module.exports = CameBackWrong;
