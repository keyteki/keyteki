import Card from '../../Card.js';

class ShellOfAGhost extends Card {
    // Play: Destroy each creature that is not on a flank. Put a
    // creature from any discard pile into play under your
    // control. Gain 2 chains.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy each creature not on a flank',
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => !card.isOnFlank())
            })),
            then: {
                alwaysTriggers: true,
                target: {
                    controller: 'any',
                    location: 'discard',
                    cardType: 'creature',
                    gameAction: ability.actions.putIntoPlay({
                        myControl: true
                    })
                },
                message: '{0} uses {1} to put {3} into play',
                messageArgs: (context) => [context.target ? context.target : 'nothing'],
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.gainChains({ amount: 2 }),
                    message: '{0} uses {1} to gain 2 chains'
                }
            }
        });
    }
}

ShellOfAGhost.id = 'shell-of-a-ghost';

export default ShellOfAGhost;
