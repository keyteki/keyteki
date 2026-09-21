const Card = require('../../Card.js');

class ArmageddonCloak extends Card {
    // This creature gains hazardous 2 and, Destroyed: Fully heal this creature and destroy Armageddon Cloak instead.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ hazardous: 2 }),
                ability.effects.gainAbility('destroyed', {
                    handler: (context) => {
                        const cloak = this;
                        context.event.replacementHandler = (leavesPlayEvent) => {
                            const card = leavesPlayEvent.card;
                            card.moribund = false;
                            card.removeToken('damage');
                            context.game.addMessage(
                                '{0} uses {1} to fully heal {2} and destroy {3} instead',
                                context.player,
                                cloak,
                                card,
                                cloak
                            );
                            context.game.actions
                                .destroy()
                                .resolve(cloak, context.game.getFrameworkContext());
                        };
                    }
                })
            ]
        });
    }
}

ArmageddonCloak.id = 'armageddon-cloak';

module.exports = ArmageddonCloak;
