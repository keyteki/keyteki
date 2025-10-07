import Card from '../../Card.js';

class TomwaOfTheGlowEvilTwin extends Card {
    // (T) Reap: If the tide is high, exhaust an enemy creature and your opponent discards a random card from their hand.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.isTideHigh(),
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.exhaust()
            },
            gameAction: ability.actions.discardAtRandom({ amount: 1 })
        });
    }
}

TomwaOfTheGlowEvilTwin.id = 'tomwa-of-the-glow-evil-twin';

export default TomwaOfTheGlowEvilTwin;
