import Card from '../../Card.js';

class SelectivePreservation extends Card {
    // Play: Choose a creature of each power value. Destroy each creature not chosen.
    setupCardAbilities(ability) {
        this.play({
            effect: 'select creatures for each power to not destroy',
            then: (preThenContext) => {
                let uniquePowers = Array.from(
                    new Set(preThenContext.game.creaturesInPlay.map((creature) => creature.power))
                );
                uniquePowers.sort((a, b) => (a > b ? 1 : -1));

                let targets = [];
                for (let i = 0; i < uniquePowers.length; i++) {
                    let power = uniquePowers[i];
                    let targetKey = 'power' + power;
                    targets[targetKey] = {
                        activePromptTitle: {
                            text: 'Choose a {{power}} creature to not destroy',
                            values: { power: power }
                        },
                        cardType: 'creature',
                        numCards: 1,
                        cardCondition: (card) => card.power === power
                    };
                }

                return {
                    alwaysTriggers: true,
                    targets: targets,
                    gameAction: ability.actions.destroy((context) => ({
                        target: context.game.creaturesInPlay.filter(
                            (card) => !Object.values(context.targets).includes(card)
                        )
                    }))
                };
            }
        });
    }
}

SelectivePreservation.id = 'selective-preservation';

export default SelectivePreservation;
