import Card from '../../Card.js';

class CloneHome extends Card {
    // Play: Make a token creature. If there are more friendly
    // creatures than enemy creatures, archive Clone Home.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.makeTokenCreature(),
                ability.actions.conditional({
                    condition: (context) =>
                        !!context.player.opponent &&
                        context.player.creaturesInPlay.length >
                            context.player.opponent.creaturesInPlay.length,
                    trueGameAction: ability.actions.archive((context) => ({
                        target: context.source
                    }))
                })
            ]),
            effect: 'make a token creature{1}{2}',
            effectArgs: (context) =>
                !!context.player.opponent &&
                context.player.creaturesInPlay.length >
                    context.player.opponent.creaturesInPlay.length
                    ? [' and archive ', context.source]
                    : ['', '']
        });
    }
}

CloneHome.id = 'clone-home';

export default CloneHome;
