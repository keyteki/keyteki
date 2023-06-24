const Card = require('../../Card.js');

class Quicksand extends Card {
    // Play: Destroy the most powerful creature controlled by each player who does not control a ready Untamed creature.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                myCreature: {
                    mode: 'mostStat',
                    cardType: 'creature',
                    numCards: 1,
                    cardStat: (card) => card.power,
                    controller: 'self',
                    cardCondition: (card) =>
                        !card.controller.creaturesInPlay.some(
                            (c) => !c.exhausted && c.hasHouse('untamed')
                        ),
                    gameAction: ability.actions.destroy()
                },
                oppCreature: {
                    mode: 'mostStat',
                    cardType: 'creature',
                    numCards: 1,
                    cardStat: (card) => card.power,
                    controller: 'opponent',
                    cardCondition: (card) =>
                        !card.controller.creaturesInPlay.some(
                            (c) => !c.exhausted && c.hasHouse('untamed')
                        ),
                    gameAction: ability.actions.destroy()
                }
            }
        });
    }
}

Quicksand.id = 'quicksand';

module.exports = Quicksand;
