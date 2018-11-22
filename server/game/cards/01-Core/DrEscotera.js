const Card = require('../../Card.js');

class DrEscotera extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.gainAmber(context => ({
                amount: context.player.opponent ? context.player.opponent.keys : 0
            }))
        });
    }
}

DrEscotera.id = 'dr-escotera'; // This is a guess at what the id might be - please check it!!!

module.exports = DrEscotera;
