const GiganticCard = require('../../GiganticCard.js');

class WretchedAnathema extends GiganticCard {
    // (Play only with the other half of Wretched Anathema.)
    // If there are no other friendly creatures in play, Wretched Anathema
    // gains, “Action: Gain 4A.”
    // Play/After Reap: Destroy 2 other creatures.
    constructor(owner, cardData) {
        super(owner, cardData);
    }

    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);

        this.persistentEffect({
            condition: (context) => context.player.creaturesInPlay.length === 1,
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.gainAmber({ amount: 4 })
            })
        });

        this.play({
            reap: true,
            target: {
                cardType: 'creature',
                mode: 'exactly',
                numCards: 2,
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

WretchedAnathema.id = 'wretched-anathema';

module.exports = WretchedAnathema;
