import Card from '../../Card.js';

class MinervasWings extends Card {
    // This creature cannot fight or reap and gains, “Action: Draw 2 cards.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.cardCannot('fight'),
                ability.effects.cardCannot('reap'),
                ability.effects.gainAbility('action', {
                    gameAction: ability.actions.draw({ amount: 2 })
                })
            ]
        });
    }
}

MinervasWings.id = 'minerva-s-wings';

export default MinervasWings;
