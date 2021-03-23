const _ = require('underscore');
const Card = require('../../Card.js');

class ForgiveOrForget extends Card {
    //Play: Choose one:
    // - Archive 2 cards of different types from your discard pile.
    // - Purge up to 2 cards from each discard pile.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.discard.length > 0 ||
                (context.player.opponent && context.player.opponent.discard.length > 0),
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Archive 2 cards': () => true,
                        'Purge up to 2 cards': () => true
                    }
                },
                'Archive 2 cards': {
                    dependsOn: 'action',
                    numCards: 2,
                    location: 'discard',
                    mode: 'exactly',
                    controller: 'self',
                    selectorCondition: (selectedCards) =>
                        _.uniq(selectedCards.map((card) => card.type)).length === 2,
                    gameAction: ability.actions.archive()
                },
                'Purge up to 2 cards': {
                    dependsOn: 'action',
                    activePromptTitle: 'Select up to 2 cards from each discard',
                    numCards: 4, // two from each discard
                    location: 'discard',
                    mode: 'upTo',
                    selectorCondition: (selectedCards) => {
                        // guarantee they're up to 2 from each owner
                        const counts = {};
                        for (let card of selectedCards) {
                            counts[card.owner.uuid] = !counts[card.owner.uuid]
                                ? 1
                                : counts[card.owner.uuid] + 1;
                            if (counts[card.owner.uuid] > 2) {
                                return false;
                            }
                        }
                        return true;
                    },
                    gameAction: ability.actions.purge()
                }
            }
        });
    }
}

ForgiveOrForget.id = 'forgive-or-forget';

module.exports = ForgiveOrForget;
