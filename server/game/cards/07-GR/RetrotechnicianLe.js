const Card = require('../../Card.js');

class RetrotechnicianLe extends Card {
    // If you are haunted, Retrotechnician Le enters play ready.
    //
    // After Reap: You may play a creature from your discard pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            condition: (context) => context.player.isHaunted(),
            effect: ability.effects.entersPlayReady()
        });

        this.reap({
            target: {
                controller: 'self',
                location: 'discard',
                cardType: 'creature',
                optional: true,
                gameAction: ability.actions.playCard()
            }
        });
    }
}

RetrotechnicianLe.id = 'retrotechnician-le';

module.exports = RetrotechnicianLe;
