const DrawCard = require('../../drawcard.js');

class IkomaEiji extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put a character into play',
            when: {
                afterConflict: event => event.conflict.loser === this.controller && event.conflict.conflictType === 'political'
            },
            handler: () => this.game.promptForSelect(this.controller, {
                source: this,
                cardType: 'character',
                cardCondition: card => (['province 1', 'province 2', 'province 3', 'province 4', 'dynasty discard pile'].includes(card.location) &&
                        card.hasTrait('bushi') && card.getCost() < 4 && card.controller === this.controller && 
                        this.controller.canPutIntoPlay(card) && !card.facedown),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} uses {1} to put {2} into play', player, this, card);
                    player.putIntoPlay(card);
                    return true;
                }
            })
        });
    }
}

IkomaEiji.id = 'ikoma-eiji';

module.exports = IkomaEiji;
