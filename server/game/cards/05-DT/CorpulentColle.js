const Card = require('../../Card.js');

class CorpulentColle extends Card {
    //Play: Capture all your opponent's A. Deal 1D to Corpulent Colle (?) for each A on it.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.capture((context) => ({
                    amount: context.player.opponent ? context.player.opponent.amber : 0
                })),
                ability.actions.dealDamage((context) => ({
                    target: context.source,
                    amount: context.source.amber ? context.source.amber : 0
                }))
            ])
        });
    }
}

CorpulentColle.id = 'corpulent-colle';

module.exports = CorpulentColle;
