const Card = require('../../Card.js');

class ExperimentalTherapy extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ['brobnar', 'dis', 'logos', 'mars', 'sanctum', 'shadows', 'untamed'].map(house => ability.effects.addHouse(house))
        });
        this.play({
            gameAction: [
                ability.actions.exhaust(context => ({ target: context.source.parent })),
                ability.actions.stun(context => ({ target: context.source.parent }))
            ]
        });
    }
}

ExperimentalTherapy.id = 'experimental-therapy'; // This is a guess at what the id might be - please check it!!!

module.exports = ExperimentalTherapy;
