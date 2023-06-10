const Card = require('../../Card.js');

class CustomVirus extends Card {
    // Omni: Sacrifice Custom Virus. Purge a creature from your hand. Destroy each creature that shares a trait with the purged creature.
    setupCardAbilities(ability) {
        this.omni({
            target: {
                optional: true,
                cardType: 'creature',
                controller: 'self',
                location: 'hand',
                gameAction: [
                    ability.actions.purge(),
                    ability.actions.destroy((context) => ({
                        target: context.target
                            ? context.game.creaturesInPlay.filter((card) =>
                                  card.getTraits().some((trait) => context.target.hasTrait(trait))
                              )
                            : []
                    }))
                ]
            },
            effect: 'purge {0} and destroy each creature which shares a trait with it',
            gameAction: ability.actions.sacrifice()
        });
    }
}

CustomVirus.id = 'custom-virus';

module.exports = CustomVirus;
