const Card = require('../../Card.js');

class PhantomDrummernaut extends Card {
    // Play/After Fight: Return a creature from your discard pile to
    // your hand.
    //
    // Destroyed: If you are haunted, archive Phantom Drummernaut.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.returnToHand({
                    location: 'discard'
                })
            }
        });

        this.destroyed({
            condition: (context) => context.source.controller.isHaunted(),
            gameAction: ability.actions.archive()
        });
    }
}

PhantomDrummernaut.id = 'phantom-drummernaut';

module.exports = PhantomDrummernaut;
