const Card = require('../../Card.js');

class TheBodySnatchers extends Card {
    // Play: For the remainder of the turn, each enemy creature gains,
    // "Destroyed: Fully heal this creature and give control of it to
    // your opponent instead."
    setupCardAbilities(ability) {
        this.play({
            effect: "give each enemy creature 'Destroyed: Fully heal this creature and give control of it to your opponent instead' for the remainder of the turn",
            gameAction: ability.actions.untilPlayerTurnEnd({
                targetController: 'opponent',
                match: (card) => card.type === 'creature',
                effect: ability.effects.gainAbility('destroyed', {
                    handler: (context) => {
                        const newController = context.player.opponent;
                        context.event.replacementHandler = (leavesPlayEvent) => {
                            const card = leavesPlayEvent.card;
                            card.removeToken('damage');
                            // Apply a permanent lasting effect so getModifiedController()
                            // returns the new controller and checkGameState doesn't revert it.
                            card.lastingEffect(() => ({
                                match: card,
                                effect: ability.effects.takeControl(newController)
                            }));
                            context.game.addMessage(
                                '{0} uses {1} to fully heal {2} and give control to {3}',
                                newController,
                                context.source,
                                card,
                                newController
                            );
                        };
                    }
                })
            })
        });
    }
}

TheBodySnatchers.id = 'the-body-snatchers';

module.exports = TheBodySnatchers;
