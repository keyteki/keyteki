const DrawCard = require('../../drawcard.js');

class GameOfSadane extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Initiate a political duel',
            targets: {
                challenger: {
                    cardType: 'character',
                    controller: 'self',
                    cardCondition: card => card.isParticipating()
                },
                duelTarget: {
                    dependsOn: 'challenger',
                    cardType: 'character',
                    controller: 'opponent',
                    cardCondition: card => card.isParticipating(),
                    gameAction: ability.actions.duel(context => ({
                        type: 'political',
                        challenger: context.targets.challenger,
                        resolutionHandler: (context, winner, loser) => this.duelOutcome(context, winner, loser)
                    }))
                }
            }
        });
    }

    duelOutcome(context, winner, loser) {
        if(loser) {
            this.game.addMessage('{0} wins the duel and is honored - {1} loses and is dishonored', winner, loser);
            this.game.applyGameAction(context, { honor: winner, dishonor: loser });
        }
    }
}

GameOfSadane.id = 'game-of-sadane';

module.exports = GameOfSadane;
