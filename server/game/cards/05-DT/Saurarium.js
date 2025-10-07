import Card from '../../Card.js';

class Saurarium extends Card {
    // Each creature with the lowest power cannot reap.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card, context) => {
                if (context.game.creaturesInPlay.length === 0) {
                    return false;
                }

                let lowestPower = context.game.creaturesInPlay.sort((a, b) => a.power - b.power)[0]
                    .power;
                return card.type === 'creature' && card.power === lowestPower;
            },
            effect: ability.effects.cardCannot('reap')
        });
    }
}

Saurarium.id = 'saurarium';

export default Saurarium;
