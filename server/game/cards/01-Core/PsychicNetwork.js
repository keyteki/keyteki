const Card = require('../../Card.js');

class PsychicNetwork extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal(context => ({
                amount: context.player.cardsInPlay.filter(card => card.hasHouse('mars') && !card.exhausted).length
            }))
        });
    }
}

PsychicNetwork.id = 'psychic-network'; // This is a guess at what the id might be - please check it!!!

module.exports = PsychicNetwork;
