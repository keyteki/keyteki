const Card = require('../../Card.js');

class EpicQuest extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'archive each friendly Knight creature',
            gameAction: ability.actions.archive(context => ({
                target: context.player.creaturesInPlay.filter(card => card.hasTrait('knight'))
            }))
        });

        this.omni({
            gameAction: ability.actions.destroy(context => ({
                target: context.game.cardsPlayed.filter(card => card.hasHouse('sanctum')).length > 6 ? context.source : []
            })),
            then: {
                condition: context => context.game.cardsPlayed.filter(card => card.hasHouse('sanctum')).length > 6,
                message: '{0} uses {1} to sacrifice {1} and forge a key at no cost',
                messageArgs: context => [context.player, context.source],
                gameAction: ability.actions.forgeKey(context => ({
                    modifier: -context.player.getCurrentKeyCost()
                }))
            }
        });
    }
}

EpicQuest.id = 'epic-quest';

module.exports = EpicQuest;
