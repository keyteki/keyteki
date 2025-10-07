import Card from '../../Card.js';

class WeighTheAnchor extends Card {
    // Play: For each creature your opponent controls in excess of
    // you, stun an enemy creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                !!context.player.opponent &&
                context.player.opponent.creaturesInPlay.length >
                    context.player.creaturesInPlay.length,
            target: {
                mode: 'exactly',
                controller: 'opponent',
                numCards: (context) =>
                    context.player.opponent.creaturesInPlay.length -
                    context.player.creaturesInPlay.length,
                gameAction: ability.actions.stun()
            }
        });
    }
}

WeighTheAnchor.id = 'weigh-the-anchor';

export default WeighTheAnchor;
