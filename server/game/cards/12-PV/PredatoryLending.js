import Card from '../../Card.js';

class PredatoryLending extends Card {
    // Play: Exalt and enrage an enemy creature.
    // Fate: Pay your opponent 1 for each enemy Shadows creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: [ability.actions.exalt(), ability.actions.enrage()]
            },
            effect: 'exalt and enrage {0}'
        });

        this.fate({
            effect: 'pay their opponent 1 amber for each enemy Shadows creature',
            gameAction: ability.actions.transferAmber((context) => ({
                amount: context.game.activePlayer.opponent.creaturesInPlay.filter((card) =>
                    card.hasHouse('shadows')
                ).length,
                target: context.game.activePlayer
            }))
        });
    }
}

PredatoryLending.id = 'predatory-lending';

export default PredatoryLending;
