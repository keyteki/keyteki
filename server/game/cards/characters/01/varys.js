const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class Varys extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPhaseEnded: (event, phase) => phase === 'dominance'
            },
            cost: ability.costs.removeSelfFromGame(),
            handler: () => {
                _.each(this.game.getPlayers(), player => {
                    let characters = player.filterCardsInPlay(card => card.getType() === 'character');
                    _.each(characters, card => {
                        player.discardCard(card);
                    });
                });

                this.game.addMessage('{0} removes {1} from the game to discard all characters',
                                     this.controller, this);
            }
        });
    }
}

Varys.code = '01029';

module.exports = Varys;
