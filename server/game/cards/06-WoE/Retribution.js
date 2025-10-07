import Card from '../../Card.js';

class Retribution extends Card {
    // Play: If there are more enemy creatures than friendly creatues, destroy an enemy creature
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent &&
                context.player.opponent.creaturesInPlay.length >
                    context.player.creaturesInPlay.length,
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Retribution.id = 'retribution';

export default Retribution;
