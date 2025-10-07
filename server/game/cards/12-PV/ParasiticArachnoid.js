import Card from '../../Card.js';

class ParasiticArachnoid extends Card {
    // Destroyed: An enemy creature captures 1A from its own side.
    // Fate: A friendly creature captures 2A from its own side.
    setupCardAbilities(ability) {
        this.destroyed({
            target: {
                controller: 'opponent',
                cardType: 'creature',
                gameAction: ability.actions.capture((context) => ({
                    amount: 1,
                    player: context.source.controller.opponent
                }))
            }
        });

        this.fate({
            target: {
                controller: 'opponent',
                cardType: 'creature',
                gameAction: ability.actions.capture((context) => ({
                    amount: 2,
                    player: context.game.activePlayer
                }))
            }
        });
    }
}

ParasiticArachnoid.id = 'parasitic-arachnoid';

export default ParasiticArachnoid;
