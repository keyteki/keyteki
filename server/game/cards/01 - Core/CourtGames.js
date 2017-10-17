const DrawCard = require('../../drawcard.js');

class CourtGames extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'political',
            max: ability.limit.perRound(1),
            target: {
                player: 'self',
                mode: 'select',
                choices: {
                    'Honor a character you control': () => this.controller.cardsInPlay.any(card => {
                        return this.game.currentConflict.isParticipating(card) && !card.isHonored;
                    }),
                    'Dishonor an opposing character': () => this.controller.opponent && this.controller.opponent.cardsInPlay.any(card => {
                        return this.game.currentConflict.isParticipating(card) && card.allowGameAction('dishonor');
                    })
                }
            },
            handler: context => {
                if(context.target === 'Honor a character you control') {
                    this.game.promptForSelect(this.controller, {
                        cardType: 'character',
                        cardCondition: card => this.game.currentConflict.isParticipating(card) && card.controller === this.controller && !card.isHonored,
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
                        cardCondition: card => this.game.currentConflict.isParticipating(card) && card.controller === otherPlayer && card.allowGameAction('dishonor'),
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

