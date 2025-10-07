import Card from '../../Card.js';

class ThinkTwice extends Card {
    // Play: Play an action card from your discard pile, then purge it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'discard',
                cardType: 'action',
                gameAction: ability.actions.sequential([
                    ability.actions.playCard(),
                    ability.actions.purge()
                ])
            }
        });
    }
}

ThinkTwice.id = 'think-twice';

export default ThinkTwice;
