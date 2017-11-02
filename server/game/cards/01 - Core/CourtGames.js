const DrawCard = require('../../drawcard.js');

class CourtGames extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'political',
            max: ability.limit.perConflict(1),
            target: {
                player: 'self',
                mode: 'select',
                choices: {
                    'Honor a character you control': context => this.controller.cardsInPlay.any(card => {
                        return card.isParticipating() && card.allowGameAction('honor', context);
                    }),
                    'Dishonor an opposing character': context => this.controller.opponent && this.controller.opponent.cardsInPlay.any(card => {
                        return card.isParticipating() && card.allowGameAction('dishonor', context);
                    })
                }
            },
            handler: context => {
                if(context.target === 'Honor a character you control') {
                    this.game.promptForSelect(this.controller, {
                        cardType: 'character',
                        cardCondition: card => card.isParticipating() && card.controller === this.controller && card.allowGameAction('honor', context),
                        source: this,
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} uses {1} to honor {2}', this.controller, this, card);
                            player.honorCard(card);
                            return true;
                        }
                    });
                } else {
                    let otherPlayer = this.game.getOtherPlayer(this.controller);
                    this.game.promptForSelect(otherPlayer, {
                        cardType: 'character',
                        cardCondition: card => card.isParticipating() && card.controller === otherPlayer && card.allowGameAction('dishonor', context),
                        source: this,
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} uses {1} to dishonor {2}', this.controller, this, card);
                            player.dishonorCard(card);
                            return true;
                        }
                    });
                }
            }
        });
    }
}

CourtGames.id = 'court-games';

module.exports = CourtGames;

