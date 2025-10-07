import Card from '../../Card.js';

class DredgingDruid extends Card {
    // Elusive.
    // (T) Reap: If the tide is high, put up to 3 creatures from your discard pile on top of your deck.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.isTideHigh(),
            target: {
                activePromptTitle: 'Select up to 3 cards (last selected goes to top of deck)',
                mode: 'upTo',
                numCards: 3,
                cardType: 'creature',
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.returnToDeck({ location: 'discard' })
            }
        });
    }
}

DredgingDruid.id = 'dredging-druid';

export default DredgingDruid;
