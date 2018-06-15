const DrawCard = require('../../drawcard.js');

class KakitaKaezin extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Duel an opposing character',
            condition: context => context.source.isParticipating(),
            target: {
                player: 'opponent',
                activePromptTitle: 'Choose a character to duel with Kaezin',
                controller: 'opponent',
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.duel(context => ({
                    type: 'military',
                    challenger: context.source,
                    resolutionHandler: (context, winner, loser) => this.resolutionHandler(context, winner, loser)
                }))
            }
        });
    }

    resolutionHandler(context, winner, loser) {
        if(winner === context.source) {
            this.game.addMessage('{0} wins the duel, and sends all characters except {0} and {1} home', winner, loser);
            this.game.applyGameAction(context, { sendHome: this.game.currentConflict.getParticipants().filter(card => ![winner, loser].includes(card)) });
        } else if(loser === context.source) {
            this.game.addMessage('{0} loses the duel, and is sent home', loser);
            this.game.applyGameAction(context, { sendHome: loser });
        }
    }
}

KakitaKaezin.id = 'kakita-kaezin';

module.exports = KakitaKaezin;
