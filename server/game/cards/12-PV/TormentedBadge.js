const Card = require('../../Card.js');

class TormentedBadge extends Card {
    // Action: Take control of an enemy Mutant creature.
    // Fate: Give control of the most powerful friendly creature to your opponent.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.hasTrait('mutant'),
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player)
                }))
            },
            effect: 'take control of {0}'
        });

        this.fate({
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                controller: 'opponent',
                cardStat: (card) => card.power,
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.game.activePlayer.opponent)
                }))
            },
            message: '{0} uses {1} to give control of {2} to their opponent',
            messageArgs: (context) => [context.player, context.source, context.target]
        });
    }
}

TormentedBadge.id = 'tormented-badge';

module.exports = TormentedBadge;
