import Card from '../../Card.js';

class CincinnatusResurrexit extends Card {
    // Cincinnatus Resurrexit gets +1 power for each A on it.
    //
    // Play/After Fight: Capture 2 A and exalt Cincinnatus Resurrexit.
    //
    // Destroyed: If you are haunted, archive Cincinnatus Resurrexit.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((target) => target.amber)
        });

        this.play({
            fight: true,
            gameAction: [ability.actions.capture({ amount: 2 }), ability.actions.exalt()]
        });

        this.destroyed({
            condition: (context) => context.source.controller.isHaunted(),
            gameAction: ability.actions.archive()
        });
    }
}

CincinnatusResurrexit.id = 'cincinnatus-resurrexit';

export default CincinnatusResurrexit;
