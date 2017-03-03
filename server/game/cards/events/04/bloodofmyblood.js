const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class BloodOfMyBlood extends DrawCard {
    canPlay(player, card) {
        if(this !== card || player.phase !== 'challenge') {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        var bloodRiders = player.searchDrawDeck(card => {
            return card.getType() === 'character' && card.hasTrait('Bloodrider');
        });

        var buttons = _.map(bloodRiders, card => {
            return { text: card.name, method: 'cardSelected', arg: card.uuid, card: card.getSummary(true) };
        });
        buttons.push({ text: 'Done', method: 'doneSelecting' });

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Select a card to put it in play',
                buttons: buttons
            },
            source: this
        });

        return true;
    }

    cardSelected(player, cardId) {
        var card = player.findCardByUuid(player.drawDeck, cardId);

        if(!card) {
            return false;
        }

        player.putIntoPlay(card);
        player.shuffleDrawDeck();

        this.atEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.returnToHandIfStillInPlay(true)
        }));

        this.game.addMessage('{0} uses {1} to reveal {2} and put it into play', player, this, card);

        return true;
    }

    doneSelecting(player) {
        player.shuffleDrawDeck();

        this.game.addMessage('{0} does not use {1} to put a card in play', player, this);

        return true;
    }
}

BloodOfMyBlood.code = '04054';

module.exports = BloodOfMyBlood;
