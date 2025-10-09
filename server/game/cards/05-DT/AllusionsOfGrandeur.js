const Card = require('../../Card.js');

class AllusionsOfGrandeur extends Card {
    // Play: Choose a house on your opponent's identity card. If your opponent does not choose that house as their active house on their next turn, gain 3A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                mode: 'house',
                houses: (context) => context.player.opponent.houses
            },
            effect: 'gain 3 amber if {1} does not choose {2} as their active house next turn',
            effectArgs: (context) => [context.player.opponent, context.house],
            effectAlert: true,
            gameAction: ability.actions.untilEndOfOpponentNextTurn((context) => ({
                targetController: 'opponent',
                when: {
                    onChooseActiveHouse: (event) =>
                        event.player !== context.player && event.house !== context.house
                },
                gameAction: ability.actions.gainAmber({
                    target: context.player,
                    amount: 3
                })
            }))
        });
    }
}

AllusionsOfGrandeur.id = 'allusions-of-grandeur';

module.exports = AllusionsOfGrandeur;
