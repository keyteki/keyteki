const DrawCard = require('../../../drawcard.js');

class WakingTheDragon extends DrawCard {

    setupCardAbilities() {
        this.action({
            title: 'Stand a character',
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card =>
                    card.location === 'play area'
                    && card.getType() === 'character'
                    && card.isFaction('targaryen')
                    && card.isUnique()
                    && card.controller === this.controller
            },
            handler: context => {
                var targetCharacter = context.target;
                context.player.standCard(targetCharacter);

                this.atEndOfPhase(ability => ({
                    match: targetCharacter,
                    effect: ability.effects.returnToHandIfStillInPlay(true)
                }));

                this.game.addMessage('{0} uses {1} to stand {2}',
                                     this.controller, this, targetCharacter);
            }
        });
    }

}

WakingTheDragon.code = '01178';

module.exports = WakingTheDragon;
