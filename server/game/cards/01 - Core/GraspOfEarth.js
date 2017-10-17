const DrawCard = require('../../drawcard.js');

class GraspOfEarth extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Opponent\'s cards cannot join this conflict',
            condition: () => this.game.currentConflict && this.bowed === false,
            cost: ability.costs.bowSelf(),
            handler: () => {
                this.game.addMessage('{0} bows {1} to prevent the opponent from bringing characters to the conflict',this.controller,this);

                //Cannot move characters into the conflict
                this.controller.opponent.cardsInPlay.each(card => {
                    if(card.type === 'character' && !card.isParticipating()) {
                        card.untilEndOfConflict(ability => ({
                            match: card,
                            effect: ability.effects.cannotMoveCharactersIntoConflict()
                        }));
                    }
                });

                //Cannot play characters
                this.untilEndOfConflict(ability => ({
                    targetType: 'player',
                    targetController: 'opponent',
                    effect: ability.effects.cannotPlay((card) => card && card.getType() === 'character')                    
                }));
            }
        });      
    }

    canAttach(player, card) {
        if(card.hasTrait('shugenja') === false) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

GraspOfEarth.id = 'grasp-of-earth';

module.exports = GraspOfEarth;
