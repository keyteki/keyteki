import Card from '../../Card.js';

class CovetousIdol extends Card {
    // During your "draw cards" step, if your opponent has more A than you, refill your hand to 1 additional card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                context.player.opponent && context.player.opponent.amber > context.player.amber,
            effect: ability.effects.modifyHandSize(1)
        });
    }
}

CovetousIdol.id = 'covetous-idol';

export default CovetousIdol;
