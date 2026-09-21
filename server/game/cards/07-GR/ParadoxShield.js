const Card = require('../../Card.js');

class ParadoxShield extends Card {
    // This creature gains "Destroyed: Discard cards from the top of
    // your deck equal to this creature's power. If you do, fully heal
    // this creature and destroy Paradox Shield instead."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('destroyed', {
                    effect: 'discard {2} cards from their deck to heal all damage from {0} and destroy {1} instead',
                    effectArgs: (context) => [this, context.source.power],
                    gameAction: ability.actions.discard((context) => ({
                        target: context.source.controller.deck.slice(0, context.source.power)
                    })),
                    then: (preThenContext) => ({
                        alwaysTriggers: true,
                        condition: (context) =>
                            context.preThenEvents.length === preThenContext.source.power,
                        handler: (context) => {
                            const shield = this;
                            preThenContext.event.replacementHandler = (leavesPlayEvent) => {
                                const card = leavesPlayEvent.card;
                                card.moribund = false;
                                card.removeToken('damage');
                                context.game.addMessage(
                                    '{0} uses {1} to fully heal {2} and destroy {3} instead',
                                    context.player,
                                    shield,
                                    card,
                                    shield
                                );
                                context.game.actions
                                    .destroy()
                                    .resolve(shield, context.game.getFrameworkContext());
                            };
                        }
                    })
                })
            ]
        });
    }
}

ParadoxShield.id = 'paradox-shield';

module.exports = ParadoxShield;
