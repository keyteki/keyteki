const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class INeverBetAgainstMyFamily extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        if(this.game.currentPhase !== 'challenge' || this.controller.faction.kneeled) {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        if(this.controller !== player) {
            return;
        }

        this.controller.kneelCard(this.controller.faction);

        this.remainingCards = this.controller.searchDrawDeck(-5);

        var revealedCardIndex = 0;
        var revealedCards = '';
        while(revealedCardIndex < this.remainingCards.length) {
            revealedCards += '{' + (revealedCardIndex + 2) + '} ';
            revealedCardIndex += 1;
        }

        this.game.addMessage('{0} uses {1} to reveal from the bottom of their deck: ' + revealedCards, player, this, ...this.remainingCards);

        this.uniqueCharacters = _.filter(this.remainingCards, card => card.isUnique() && card.getType() === 'character' && card.getFaction() === 'lannister');

        if(this.uniqueCharacters.length > 0) {
            this.promptToChooseCharacter();
        } else {
            this.promptToPlaceNextCard();
        }

        return true;
    }

    promptToChooseCharacter() {
        var buttons = _.map(this.uniqueCharacters, card => ({
            text: card.name, method: 'selectCharacter', arg: card.uuid, card: card.getSummary(true)
        }));

        buttons.push({ text: 'None', method: 'promptToPlaceNextCard' });

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose a unique character to put in play',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        return true;
    }

    selectCharacter(player, cardId) {
        var card = _.find(this.remainingCards, card => card.uuid === cardId);

        if(!card) {
            return false;
        }

        this.remainingCards = _.reject(this.remainingCards, card => card.uuid === cardId);
        this.controller.playCard(card, true, true);
        this.game.addMessage('{0} uses {1} to put {2} into play', this.controller, this, card);
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.discardIfStillInPlay(false)
        }));
        this.promptToPlaceNextCard();

        return true;
    }

    promptToPlaceNextCard() {
        var buttons = _.map(this.remainingCards, card => ({
            text: card.name, method: 'selectCardForBottom', arg: card.uuid, card: card.getSummary(true)
        }));

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose card to place on bottom of deck',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        return true;
    }

    selectCardForBottom(player, cardId) {
        var card = _.find(this.remainingCards, card => card.uuid === cardId);

        if(!card) {
            return false;
        }

        this.remainingCards = _.reject(this.remainingCards, card => card.uuid === cardId);
        this.controller.moveCard(card, 'draw deck', { bottom: true });

        if(this.remainingCards.length > 0) {
            this.promptToPlaceNextCard();
        } else {
            this.game.addMessage('{0} placed the remaining cards on the bottom of their deck', this.controller);
        }

        return true;
    }
}

INeverBetAgainstMyFamily.code = '02050';

module.exports = INeverBetAgainstMyFamily;
