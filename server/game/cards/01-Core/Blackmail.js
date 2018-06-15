const DrawCard = require('../../drawcard.js');

class Blackmail extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Take control of a character',
            condition: () => this.game.currentConflict,
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

    canPlay(context) {
        if(this.controller.opponent && this.controller.honor < this.controller.opponent.honor) {
            return super.canPlay(context);
        }
        return false;
    }
}

Blackmail.id = 'blackmail';

module.exports = Blackmail;
