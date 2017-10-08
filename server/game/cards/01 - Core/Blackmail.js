const DrawCard = require('../../drawcard.js');

class Blackmail extends DrawCard {
    setupCardAbilities() {
        this.action({
            clickToActivate: true,
            condition: () => this.controller.opponent && this.controller.honor < this.controller.opponent.honor && this.game.currentConflict,
            target: {
                cardType: 'character',
                cardCondition: card => card.controller !== this.controller && card.getCost() < 3
            },
            handler: context => {
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: ability.effects.takeControl(this.controller)
                }));
            }
        });
    }
}

Blackmail.id = 'blackmail';

module.exports = Blackmail;
