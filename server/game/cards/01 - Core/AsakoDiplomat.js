const DrawCard = require('../../drawcard.js');

class AsakoDiplomat extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterConflict: (event, params) => params.conflict.winner === this.controller && params.conflict.isParticipating(this)
            },
            choices: {
                'Honor a character': () => {
                    this.game.promptForSelect(this.controller, {
                        activePromptTitle: 'Select a character to honor',
                        cardType: 'character',
                        cardCondition: card => card.location === 'play area',
                        onSelect: (player, card) => {
                            player.honorCard(card);
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
