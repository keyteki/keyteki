import Card from '../../Card.js';

class GasPipesMalone extends Card {
    // Before Fight: The creature Gas-Pipes Malone fights captures 1A from its own side.
    setupCardAbilities(ability) {
        this.beforeFight({
            gameAction: ability.actions.capture((context) => ({
                amount: 1,
                target: context.event.card,
                player: context.event.card.controller
            }))
        });
    }
}

GasPipesMalone.id = 'gas-pipes-malone';

export default GasPipesMalone;
