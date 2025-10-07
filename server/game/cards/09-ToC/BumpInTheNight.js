import Card from '../../Card.js';

class BumpInTheNight extends Card {
    // Play: Deal 2D to an enemy creature. If this damage destroys
    // that creature, make a token creature. If you are haunted,
    // repeat the preceding effect.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.conditional({
                    condition: (context) =>
                        context.preThenEvent &&
                        context.preThenEvent.destroyEvent &&
                        context.preThenEvent.destroyEvent.destroyedByDamageDealt &&
                        context.preThenEvent.destroyEvent.resolved,
                    trueGameAction: ability.actions.makeTokenCreature()
                }),
                then: {
                    alwaysTriggers: true,
                    condition: (context) =>
                        !preThenContext.secondResolution && context.player.isHaunted(),
                    gameAction: ability.actions.resolveAbility({
                        ability: preThenContext.ability,
                        secondResolution: true
                    }),
                    message: '{0} uses {1} to repeat the preceding effect'
                }
            })
        });
    }
}

BumpInTheNight.id = 'bump-in-the-night';

export default BumpInTheNight;
