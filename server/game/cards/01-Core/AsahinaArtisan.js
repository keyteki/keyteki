const DrawCard = require('../../drawcard.js');

class AsahinaArtisan extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character +0/+3',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.bowSelf(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card !== context.source && card.isFaction('crane'),
                gameAction: ability.actions.cardLastingEffect(() => ({
                    duration: 'untilEndOfConflict',
                    effect: ability.effects.modifyPoliticalSkill(3)
                }))
            },
            effect: 'give {0} +3{1} skill',
            effectArgs: () => 'political'
        });
    }
}

AsahinaArtisan.id = 'asahina-artisan';

module.exports = AsahinaArtisan;
