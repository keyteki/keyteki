import Card from '../../Card.js';

class TradingFrenzy extends Card {
    // Play: A friendly creature and an enemy creature each capture 3
    // Aember from their opponent.
    setupCardAbilities(ability) {
        this.play({
            effectStyle: 'all',
            targets: {
                friendly: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.capture({ amount: 3 })
                },
                enemy: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.capture((context) => ({
                        player: context.player,
                        amount: 3
                    }))
                }
            }
        });
    }
}

TradingFrenzy.id = 'trading-frenzy';

export default TradingFrenzy;
