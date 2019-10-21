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
            condition: context => context.game.cardsPlayed.filter(card => card.hasHouse('sanctum')).length > 6,
            effect: 'sacrifice {0} and forge a key at no cost',
            gameAction: [
                ability.actions.sacrifice(),
                ability.actions.forgeKey(context => ({
                    modifier: -context.player.getCurrentKeyCost()
                }))
            ]
        });
    }
}

EpicQuest.id = 'epic-quest';

module.exports = EpicQuest;
