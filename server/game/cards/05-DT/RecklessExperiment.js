const Card = require('../../Card.js');

class RecklessExperiment extends Card {
    //This creature gains: "Reap: Play the top card of your deck."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.playCard((context) => ({
                    target: context.player.deck[0]
                }))
            })
        });
    }
}

RecklessExperiment.id = 'reckless-experiment';

module.exports = RecklessExperiment;
