const DrawCard = require('../../../drawcard.js');

class WolfInTheNight extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give +3 STR and renown to character',
            condition: () => this.game.currentChallenge,
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.isFaction('stark') &&
                    this.game.currentChallenge.attackers.length === 1 && this.game.currentChallenge.isAttacking(card)
            },
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: [
                        ability.effects.modifyStrength(3),
                        ability.effects.addKeyword('Renown')
                    ]
                }));

                this.game.addMessage('{0} uses {1} to give {2} +3 STR and renown until the end of the challenge', context.player, this, context.target);
            }
        });
    }
}

WolfInTheNight.code = '04102';

module.exports = WolfInTheNight;
