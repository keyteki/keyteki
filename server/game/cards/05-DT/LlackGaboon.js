import Card from '../../Card.js';

class LlackGaboon extends Card {
    // Llack Gaboon gets +1 power for each other exhausted creature. If there are 3 or more other exhausted creatures, Llack Gaboon gains skirmish and hazardous 5.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower(
                (_, context) =>
                    context.game.creaturesInPlay.filter(
                        (card) => card !== context.source && card.exhausted
                    ).length
            )
        });

        this.persistentEffect({
            condition: (context) =>
                context.game.creaturesInPlay.filter(
                    (card) => card !== context.source && card.exhausted
                ).length >= 3,
            effect: [
                ability.effects.addKeyword({
                    skirmish: 1
                }),
                ability.effects.addKeyword({
                    hazardous: 5
                })
            ]
        });
    }
}

LlackGaboon.id = 'llack-gaboon';

export default LlackGaboon;
