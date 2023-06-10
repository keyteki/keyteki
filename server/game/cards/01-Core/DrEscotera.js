const Card = require('../../Card.js');

class DrEscotera extends Card {
    // Play: Gain 1<A> for each forged key your opponent has.
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
