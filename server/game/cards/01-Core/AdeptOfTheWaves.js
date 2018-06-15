const DrawCard = require('../../drawcard.js');

class AdeptOfTheWaves extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Grant Covert to a character',
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to grant Covert during Water conflicts to {2}', this.controller, this, context.target);
                this.untilEndOfPhase(ability => ({
                    match: context.target,
                    condition: () => this.game.currentConflict && this.game.currentConflict.conflictRing === 'water',
                    effect: ability.effects.addKeyword('covert')
                }));
            }
        });
    }
}

AdeptOfTheWaves.id = 'adept-of-the-waves';

module.exports = AdeptOfTheWaves;
