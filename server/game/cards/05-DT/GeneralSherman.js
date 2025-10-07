import Card from '../../Card.js';

class GeneralSherman extends Card {
    // General Sherman deals no damage when fighting.
    // Play: Purge each other creature. If General Sherman leaves play, return to play each creature purged this way (exhausted and under its owner’s control).
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.cardCannot('dealFightDamage')
        });

        this.play({
            effect: 'purge each other creature',
            gameAction: [
                ability.actions.purge((context) => ({
                    purgedBy: context.source,
                    target: context.game.creaturesInPlay.filter((card) => card !== context.source)
                })),
                ability.actions.lastingEffect({
                    targetController: 'current',
                    multipleTrigger: false,
                    when: {
                        onCardLeavesPlay: (event, context) => event.card === context.source
                    },
                    gameAction: ability.actions.sequentialPutIntoPlay((context) => ({
                        forEach: context.event.clone.clonedPurgedCards
                    })),
                    message: '{0} put into play all creatures purged by {1}',
                    messageArgs: (context) => [context.game.activePlayer, context.source]
                })
            ]
        });
    }
}

GeneralSherman.id = 'general-sherman';

export default GeneralSherman;
