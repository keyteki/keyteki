import Card from '../../Card.js';

class DeltaP extends Card {
    // Play: Destroy an enemy creature. If your opponent controls more
    // creatures than you, repeat this effect.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent,
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.destroy()
            },
            then: (preThenContext) => ({
                condition: (context) =>
                    context.player.creaturesInPlay.length <
                    context.player.opponent.creaturesInPlay.length,
                alwaysTriggers: true,
                gameAction: ability.actions.resolveAbility({ ability: preThenContext.ability })
            })
        });
    }
}

DeltaP.id = 'delta-p';

export default DeltaP;
