const DrawCard = require('../../drawcard.js');

class KakitaKaezin extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Duel an opposing character',
            condition: () => this.isParticipating(),
            target: {
                player: 'opponent',
                cardType: 'character',
                cardCondition: card => card.controller !== this.controller && card.isParticipating() && card.getMilitarySkill(true) !== undefined
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to challenge {2} to a duel', this.controller, this, context.target);
                this.game.initiateDuel(this, context.target, (winner, loser) => {
                    if(winner === this) {
                        this.game.addMessage('{0} wins the duel, and sends all characters except {0} and {1} home', winner, loser);
                        let cards = this.game.allCards.filter(card => {
                            return (card.type === 'character' &&
                                    card.location === 'play area' &&
                                    card.isParticipating() && 
                                    card !== loser &&
                                    card !== winner &&
                                    card.allowGameAction('sendHome'));
                        });
                        this.game.raiseSimultaneousEvent(cards, {
                            eventName: 'onSendCharactersHome',
                            perCardEventName: 'OnSendHome',
                            perCardHandler: params => this.game.currentConflict.removeFromConflict(params.card), 
                            params: { conflict: this.game.currentConflict }
                        });
                    } else {
                        this.game.addMessage('{0} wins the duel, and {1} is sent home', winner, loser);
                        this.game.currentConflict.sendHome(loser);
                    }
                });
            }
        });
    }
}

KakitaKaezin.id = 'kakita-kaezin';

module.exports = KakitaKaezin;
