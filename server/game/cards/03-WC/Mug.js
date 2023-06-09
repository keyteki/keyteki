const Card = require('../../Card.js');

class Mug extends Card {
    // Play: Move 1 from a creature to your pool. Deal 2 to that creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                activePromptTitle: 'Choose a captured amber to move to your pool.',
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.returnAmber((context) => ({
                        amount: 1,
                        recipient: context.player
                    })),
                    ability.actions.dealDamage({ amount: 2 })
                ])
            },
            effect: 'move 1 amber from {0} to their pool and deal 2 damage to it'
        });
    }
}

Mug.id = 'mug';

module.exports = Mug;
