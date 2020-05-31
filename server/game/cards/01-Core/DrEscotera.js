const Card = require('../../Card.js');

class DrEscotera extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.player.opponent ? context.player.opponent.getForgedKeys() : 0
            }))
        });
    }
}

DrEscotera.id = 'dr-escotera';

module.exports = DrEscotera;
