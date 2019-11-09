const Card = require('../../Card.js');

class Weasand extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            condition: context => !!context.player.opponent,
            when: {
                onForgeKey: (event, context) => event.player === context.player.opponent
            },
            gameAction: ability.actions.gainAmber({ amount: 2 })
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card.type === 'creature' && this.isOnFlank(),
                onCardMovedInBattleline: (event, context) => event.card.type === 'creature' && this.isOnFlank(),
                onCardLeavesPlay: (event, context) => event.card.type === 'creature' && this.isOnFlank()
            },
            gameAction: ability.actions.destroy({ target: this })
        });
    }
}

Weasand.id = 'weasand';

module.exports = Weasand;
