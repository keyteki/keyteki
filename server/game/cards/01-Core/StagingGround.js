const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class StagingGround extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Flip up to 2 dynasty cards',
            target: {
                mode: 'upTo',
                numCards: 2,
                activePromptTitle: 'Choose up to 2 cards',
                cardCondition: card => {
                    return (['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) && 
                            card.isDynasty && card.facedown && card.controller === this.controller);
                }
            },
            handler: context => {
                if(context.target.length > 0) {
                    _.each(context.target, card => card.facedown = false);
                    this.game.addMessage('{0} uses {1} to flip {2} faceup', this.controller, this, context.target);
                } else {
                    this.game.addMessage('{0} uses {1} to flip nothing', this.controller, this);
                }
            }
        });
    }
}

StagingGround.id = 'staging-ground';

module.exports = StagingGround;
