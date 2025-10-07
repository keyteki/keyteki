import Card from '../../Card.js';

class Conscription extends Card {
    // Play: If there are more enemy creatures than friendly
    // creatures, make a number of token creatures equal to the
    // difference.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature((context) => ({
                amount:
                    !!context.player.opponent &&
                    context.player.opponent.creaturesInPlay.length >
                        context.player.creaturesInPlay.length
                        ? context.player.opponent.creaturesInPlay.length -
                          context.player.creaturesInPlay.length
                        : 0
            }))
        });
    }
}

Conscription.id = 'conscription';

export default Conscription;
