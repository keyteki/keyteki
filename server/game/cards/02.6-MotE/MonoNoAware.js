const DrawCard = require('../../drawcard.js');

class MonoNoAware extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            title: 'Remove 1 fate from each character. Draw 1 card.',
            effect: 'remove a fate from each character and draw a card',
            gameAction: [
                ability.actions.draw(),
                ability.actions.removeFate(() => ({
                    target: this.game.findAnyCardsInPlay(card => card.fate > 0)
                }))
            ],
            max: ability.limit.perRound(1)
        });
    }
}

MonoNoAware.id = 'mono-no-aware'; // This is a guess at what the id might be - please check it!!!

module.exports = MonoNoAware;
