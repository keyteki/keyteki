const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class TimeForWar extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put a weapon into play',
            when: {
                afterConflict: event => event.conflict.loser === this.controller && event.conflict.conflictType === 'political'
            },
            target: {
                cardType: 'character',
                cardCondition: card => {
                    let weapons = this.controller.conflictDiscardPile.filter(card => card.type === 'attachment' && card.hasTrait('weapon') && card.getCost() < 4);
                    weapons = weapons.concat(this.controller.hand.filter(card => card.type === 'attachment' && card.hasTrait('weapon') && card.getCost() < 4));
                    return (weapons.length > 0 && card.controller === this.controller && card.hasTrait('bushi') && 
                            _.any(weapons, weapon => this.controller.canAttach(weapon, card)));
                }
            },
            handler: context => this.game.promptForSelect(this.controller, {
                cardType: 'attachment',
                source: this,
                cardCondition: card => card.hasTrait('weapon') && card.getCost() < 4 && this.controller.canAttach(card, context.target),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} plays {1}, attaching {2} to {3}', player, this, card, context.target);
                    player.attach(card, context.target);
                    return true;
                }
            })
        });
    }
}

TimeForWar.id = 'time-for-war';

module.exports = TimeForWar;
