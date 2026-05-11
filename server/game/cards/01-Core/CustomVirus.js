const Card = require('../../Card.js');

class CustomVirus extends Card {
    // Omni: Destroy Custom Virus. You may purge a creature from your hand. If you do, destroy each creature that shares a trait with the purged creature.
    setupCardAbilities(ability) {
        this.omni({
            target: {
                optional: true,
                cardType: 'creature',
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.purge()
            },
            effect: 'purge {0} and destroy each creature which shares a trait with it',
            gameAction: ability.actions.destroy(),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                condition: (context) => {
                    const selfDestroyed = context.preThenEvents.some(
                        (event) =>
                            event.name === 'onCardDestroyed' &&
                            event.card === context.source &&
                            event.resolved
                    );
                    const creaturePurged = context.preThenEvents.some(
                        (event) =>
                            event.name === 'onCardPurged' &&
                            event.card === preThenContext.target &&
                            event.resolved
                    );
                    return selfDestroyed && creaturePurged;
                },
                gameAction: ability.actions.destroy({
                    target: preThenContext.target
                        ? preThenContext.game.creaturesInPlay.filter((card) =>
                              card
                                  .getTraits()
                                  .some((trait) => preThenContext.target.hasTrait(trait))
                          )
                        : []
                })
            })
        });
    }
}

CustomVirus.id = 'custom-virus';

module.exports = CustomVirus;
