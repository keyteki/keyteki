const DrawCard = require('../../drawcard.js');

class ShibaTetsu extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain +1/+1',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: event => (
                    event.player === this.controller && event.card.hasTrait('spell') && this.game.currentConflict
                )
            },
            handler: context => {
                this.game.addMessage('{0} uses {1}, giving him +1{2}/+1{3}', context.player, context.source, 'military', 'political'); 
                context.source.untilEndOfConflict(ability => ({
                    match: context.source,
                    effect: [
                        ability.effects.modifyMilitarySkill(1),
                        ability.effects.modifyPoliticalSkill(1)
                    ]
                }));
            }
        });
    }
}

ShibaTetsu.id = 'shiba-tetsu';

module.exports = ShibaTetsu;
