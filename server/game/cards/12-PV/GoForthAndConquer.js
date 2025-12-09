const Card = require('../../Card.js');

class GoForthAndConquer extends Card {
    // During your opponent's turn, after an enemy creature is used to fight, fulfill Go Forth and Conquer.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                // We need to use onUseCard instead of onFight because onFight
                // reactions do not fire if the fight is cancelled due to the
                // attacker or defender dying early from assault / hazardous.
                //
                // See: https://github.com/keyteki/keyteki/issues/4671
                onUseCard: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    event.fight &&
                    event.fightEvent.attacker.controller === context.source.controller.opponent
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

GoForthAndConquer.id = 'go-forth-and-conquer';

module.exports = GoForthAndConquer;
