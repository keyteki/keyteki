const Card = require('../../Card.js');

class EpicQuest extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: 'archive each friendly Knight creature',
            gameAction: ability.actions.archive(context => ({
                target: context.player.creaturesInPlay.filter(card => card.hasTrait('knight'))
            }))
        });

        this.omni({
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

EpicQuest.id = 'epic-quest'; // This is a guess at what the id might be - please check it!!!

module.exports = EpicQuest;
