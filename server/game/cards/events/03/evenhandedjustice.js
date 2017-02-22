const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class EvenHandedJustice extends DrawCard {

    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        return (_.every(this.game.getPlayers(), this.hasStandingCharacters)
                && super.canPlay(player, card));
    }

    hasStandingCharacters(player) {
        return (player.cardsInPlay
                .filter(card => card.getType() === 'character' && !card.kneeled)
                .length > 0);
    }

    play(player) {
        this.waitingPrompt = 'Waiting for opponent to use ' + this.name;

        this.toKneel = [];  // characters to kneel (later)

        // step 1: select opponent character
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a standing character controlled by your opponent',
            waitingPromptTitle: this.waitingPrompt,
            cardCondition: card =>
                !card.kneeled
                && card.getType() === 'character'
                && card.controller !== this.controller,  // not event controller
            onSelect: (player, card) => this.onFirstCardSelected(player, card)
        });

        return true;
    }

    onFirstCardSelected(player, card) {
        this.toKneel.push(card);

        // step 2: select event controller character
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a standing character of yours',
            waitingPromptTitle: this.waitingPrompt,
            cardCondition: card =>
                !card.kneeled
                && card.getType() === 'character'
                && card.controller === this.controller,  // event controller
            onSelect: (player, card) => this.onSecondCardSelected(player, card)
        });

        return true;
    }

    onSecondCardSelected(player, card) {
        this.toKneel.push(card);

        if(! _.every(this.game.getPlayers(), player => _.some(this.toKneel, card => card.controller === player))) {
            // proceed only if toKneel contain at least one card per player
            return true;
        }

        // step 3: kneel selected characters
        _.each(this.toKneel, card => card.controller.kneelCard(card));

        var kneeledCards = _.map(this.toKneel, card => card.name);
        this.game.addMessage('{0} uses {1} to kneel {2}',
                             player, this, kneeledCards);

        return true;
    }

}

EvenHandedJustice.code = '03026';

module.exports = EvenHandedJustice;
