import Card from '../../Card.js';

class TreokTheWise extends Card {
    // After Reap: Choose a creature. Until the start of your next turn, that creature gains invulnerable.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilNextTurn',
                    effect: ability.effects.addKeyword({ invulnerable: 1 })
                })
            },
            effect: 'give {0} invulnerable until the start of their next turn'
        });
    }
}

TreokTheWise.id = 'treok-the-wise';

export default TreokTheWise;
