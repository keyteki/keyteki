const Card = require('../../Card.js');

class BlorbHive extends Card {
    // Omni: Destroy a friendly creature. If you do, make 2
    // Blorbs. Then, if you control 10 or more, Blorbs, destroy Blorb
    // Hive and forge a key at no cost.
    setupCardAbilities(ability) {
        this.omni({
            effectStyle: 'all',
            target: {
                controller: 'self',
                cardType: 'creature',
                gameAction: ability.actions.destroy()
            },
            then: {
                gameAction: ability.actions.sequential([
                    ability.actions.conditional({
                        condition: (context) =>
                            !!context.player.tokenCard && context.player.tokenCard.name === 'Blorb',
                        trueGameAction: ability.actions.makeTokenCreature({ amount: 2 })
                    }),
                    ability.actions.conditional({
                        condition: (context) =>
                            context.player.creaturesInPlay.filter((card) => card.name === 'Blorb')
                                .length >= 10,
                        trueGameAction: ability.actions.sequential([
                            ability.actions.sacrifice(),
                            ability.actions.forgeKey((context) => ({
                                modifier: -context.player.getCurrentKeyCost()
                            }))
                        ])
                    })
                ])
            }
        });
    }
}

BlorbHive.id = 'blorb-hive';

module.exports = BlorbHive;
