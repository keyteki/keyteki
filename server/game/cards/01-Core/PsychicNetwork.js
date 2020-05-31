const Card = require('../../Card.js');

class PsychicNetwork extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal((context) => ({
                amount: context.player.creaturesInPlay.filter(
                    (card) => card.hasHouse('mars') && !card.exhausted
                ).length
            }))
        });
    }
}

PsychicNetwork.id = 'psychic-network';

module.exports = PsychicNetwork;
