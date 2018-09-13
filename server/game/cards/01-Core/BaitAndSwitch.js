const Card = require('../../Card.js');

class BaitAndSwitch extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.opponent && context.player.amber < context.player.opponent.amber,
            gameAction: ability.actions.steal(),
            then: context => ({
                condition: () => context.player.amber < context.player.opponent.amber,
                gameAction: ability.actions.resolveAbility({ ability: context.ability })
            })
        });
    }
}

BaitAndSwitch.id = 'bait-and-switch'; // This is a guess at what the id might be - please check it!!!

module.exports = BaitAndSwitch;
