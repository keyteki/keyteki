const DrawCard = require('../../drawcard.js');

class MirumotoRaitsugu extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Duel an opposing character',
            condition: () => this.isParticipating(),
            target: {
                cardType: 'character',
                cardCondition: card => card.controller !== this.controller && card.isParticipating() && card.getMilitarySkill(true) !== undefined
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to challenge {2} to a duel', this.controller, this, context.target);
                this.game.initiateDuel(this, context.target, 'military', (winner, loser) => {
                    if(loser.fate > 0) {
                        this.game.addMessage('{0} wins the duel, and {1} loses a fate', winner, loser);
                        this.game.applyGameAction(context, { removeFate: loser });
                    } else {
                        this.game.addMessage('{0} wins the duel, and {1} is discarded', winner, loser);
                        this.game.applyGameAction(context, { discardFromPlay: loser });
                    }
                });
            }
        });
    }
}

MirumotoRaitsugu.id = 'mirumoto-raitsugu';

module.exports = MirumotoRaitsugu;
