const Card = require('../../Card.js');

class ExperimentalTherapy extends Card {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addHouse(['brobnar', 'dis', 'logos', 'mars', 'sanctum', 'shadows', 'untamed'])
        });
        this.play({
            gameAction: [
                ability.actions.exhaust(),
                ability.actions.stun()
            ]
        });
    }
}

ExperimentalTherapy.id = 'experimental-therapy'; // This is a guess at what the id might be - please check it!!!

module.exports = ExperimentalTherapy;
