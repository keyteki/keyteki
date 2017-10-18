const DrawCard = require('../../drawcard.js');

class ShosuroMiyako extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Opponent discards or dishonors',
            when: {
                onCardPlayed: event => {
                    return (event.player === this.controller && 
                            event.card.type === 'character' && 
                            event.originalLocation === 'hand' && 
                            this.controller.opponent);
                }
            },
            target: {
                mode: 'select',
                player: 'opponent',
                choices: {
                    'Discard at random': () => this.controller.opponent.hand.size() > 0,
                    'Dishonor a character': () => this.controller.opponent.anyCardsInPlay(card => card.allowGameAction('dishonor'))
                }
            },
            handler: context => {
                if(context.target === 'Discard at random') {
                    this.game.addMessage('{0} uses {1} - {2} chose to discard a card at random', this.controller, this, this.controller.opponent);
                    this.controller.opponent.discardAtRandom(1);
                } else {
                    this.game.promptForSelect(this.controller.opponent, {
                        source: this,
                        cardType: 'character',
                        cardCondition: card => card.controller === this.controller.opponent && card.location === 'play area' && card.allowGameAction('dishonor'),
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} uses {1} - {2} chose to dishonor {3}', this.controller, this, player, card);
                            player.dishonorCard(card);
                            return true;
                        }
                    });
                }
            }
        });
    }
}

ShosuroMiyako.id = 'shosuro-miyako';

module.exports = ShosuroMiyako;
