const Card = require('../../Card.js');

class ModularExoskeleton extends Card {
    // This creature gets +4 power.
    //
    // At the beginning of your turn, you may return Modular
    // exoskeleton from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyPower(4)
        });

        this.reaction({
            when: {
                onTurnStart: (_, context) => context.player === this.game.activePlayer
            },
            optional: true,
            location: 'discard',
            gameAction: ability.actions.returnToHand((context) => ({
                location: 'discard',
                target: context.source
            }))
        });
    }
}

ModularExoskeleton.id = 'modular-exoskeleton';

module.exports = ModularExoskeleton;
