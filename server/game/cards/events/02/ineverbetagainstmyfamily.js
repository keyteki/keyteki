const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class INeverBetAgainstMyFamily extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put character in play from bottom of your deck',
            phase: 'challenge',
            cost: ability.costs.kneelFactionCard(),
            handler: () => {
                this.remainingCards = this.controller.searchDrawDeck(-5);

                this.game.addMessage('{0} uses {1} to reveal from the bottom of their deck: {2}', this.controller, this, this.remainingCards);

                this.uniqueCharacters = _.filter(this.remainingCards, card => card.isUnique() && card.getType() === 'character' && card.isFaction('lannister'));

                if(this.uniqueCharacters.length > 0) {
                    this.promptToChooseCharacter();
                } else {
                    this.promptToPlaceNextCard();
                }
            }
        });
    }

    promptToChooseCharacter() {
        var buttons = _.map(this.uniqueCharacters, card => ({
            method: 'selectCharacter', card: card
        }));

        buttons.push({ text: 'None', method: 'promptToPlaceNextCard' });

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose a unique character to put in play',
                buttons: buttons
            },
            source: this
        });

        return true;
    }

    selectCharacter(player, cardId) {
        var card = _.find(this.remainingCards, card => card.uuid === cardId);

        if(!card) {
            return false;
        }

        this.remainingCards = _.reject(this.remainingCards, card => card.uuid === cardId);
        this.controller.putIntoPlay(card);
        this.game.addMessage('{0} uses {1} to put {2} into play', this.controller, this, card);
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.discardIfStillInPlay(false)
        }));
        this.promptToPlaceNextCard();

        return true;
    }

    promptToPlaceNextCard() {
        if(this.remainingCards.length === 0) {
            return true;
        }

        var buttons = _.map(this.remainingCards, card => ({
            method: 'selectCardForBottom', card: card
        }));

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Choose card to place on bottom of deck',
                buttons: buttons
            },
            source: this
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
