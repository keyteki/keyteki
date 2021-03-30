const Card = require('../../Card.js');

class SelectivePreservation extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'Select creatures for each power to not destroy.',

            then: (preThenContext) => {
                let unqiuePowers = Array.from(
                    new Set(
                        preThenContext.game.creaturesInPlay.map((creature) =>
                            creature.getPower(false)
                        )
                    )
                );
                unqiuePowers.sort((a, b) => (a > b ? 1 : -1));

                let targets = [];
                for (let i = 0; i < unqiuePowers.length; i++) {
                    let power = unqiuePowers[i];
                    let targetKey = 'power' + power;
                    targets[targetKey] = {
                        activePromptTitle: {
                            text: 'Choose a {{power}} creature to not destroy',
                            values: { power: power }
                        },
                        cardType: 'creature',
                        numCards: 1,
                        cardCondition: (card) => card.getPower(false) === power,
                        gameAction: ability.actions.destroy((context) => ({
                            target: context.game.creaturesInPlay.filter(
                                (card) =>
                                    context.targets[targetKey] !== card &&
                                    card.getPower(false) === power
                            )
                        }))
                    };
                }

                return {
                    alwaysTriggers: true,
                    targets: targets
                };
            }
        });
    }
}

SelectivePreservation.id = 'selective-preservation';

module.exports = SelectivePreservation;
