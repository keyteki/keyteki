import Card from '../../Card.js';

class Initiation extends Card {
    //Play: Make a token creature. If you have fewer than 4 cards in hand, archive Initiation.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make a token creature{1}',
            effectArgs: (context) => (context.player.hand.length < 4 ? ' and archive itself' : ''),
            gameAction: ability.actions.sequential([
                ability.actions.makeTokenCreature(),
                ability.actions.conditional({
                    condition: (context) => context.player.hand.length < 4,
                    trueGameAction: ability.actions.archive()
                })
            ])
        });
    }
}

Initiation.id = 'initiation';

export default Initiation;
