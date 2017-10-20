const DrawCard = require('../../drawcard.js');

class AsakoDiplomat extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Honor or dishonor a character',
            when: {
                afterConflict: event => event.conflict.winner === this.controller && event.conflict.isParticipating(this)
            },
            choices: {
                'Honor a character': () => {
                    this.game.promptForSelect(this.controller, {
                        activePromptTitle: 'Select a character to honor',
                        cardType: 'character',
                        cardCondition: card => card.location === 'play area',
                        onSelect: (player, card) => {
                            player.honorCard(card);
                            this.game.addMessage('{0} uses {1} to honor {2}', this.controller, this, card);
                            return true;
                        },
                        source: this
                    });
                },
                'Dishonor a character': () => {
                    this.game.promptForSelect(this.controller, {
                        activePromptTitle: 'Select a character to dishonor',
                        cardType: 'character',
                        cardCondition: card => card.location === 'play area',
                        onSelect: (player, card) => {
                            player.dishonorCard(card);
                            this.game.addMessage('{0} uses {1} to dishonor {2}', this.controller, this, card);
                            return true;
                        },
                        source: this
                    });
                }
            } 
        });
    }
}

AsakoDiplomat.id = 'asako-diplomat';

module.exports = AsakoDiplomat;
