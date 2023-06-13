const Card = require('../../Card.js');

class Pismire extends Card {
    // While there are more friendly Mutant creatures than enemy Mutant creatures, your opponents keys cost +2A.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            condition: (context) =>
                context.player.opponent &&
                context.player.creaturesInPlay.filter((card) => card.hasTrait('mutant')).length >
                    context.player.opponent.creaturesInPlay.filter((card) =>
                        card.hasTrait('mutant')
                    ).length,
            effect: ability.effects.modifyKeyCost(2)
        });
    }
}

Pismire.id = 'pismire';

module.exports = Pismire;
