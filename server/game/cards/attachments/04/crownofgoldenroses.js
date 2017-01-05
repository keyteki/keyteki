const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class CrownOfGoldenRoses extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard a card to give attached character STR',
            method: 'boost',
            limit: { amount: 2, period: 'round' }
        });
    }

    boost(player) {
        if(!this.parent) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character to discard',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'hand',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        this.controller.discardCard(card);

        var icons = 0;

        if(this.parent.hasIcon('military')) {
            icons++;
        }

        if(this.parent.hasIcon('intrigue')) {
            icons++;
        }

        if(this.parent.hasIcon('power')) {
            icons++;
        }

        this.parent.strengthModifier += icons;

        this.modifiedStr += icons;

        if(!this.eventRegistered) {
            this.game.once('onPhaseEnded', this.onPhaseEnded.bind(this));
            this.eventRegistered = true;
        }

        this.game.addMessage('{0} uses {1} to discard {2} to give {3} +{4} STR', player, this, card, this.parent, icons);

        return true;
    }

    canAttach(player, card) {
        if(!card.hasTrait('Lord')) {
            return false;
        }

        return super.canAttach(player, card);
    }

    attach(player, card) {
        card.addTrait('King');

        super.attach(player, card);

        this.modifiedStr = 0;
    }

    leavesPlay(player) {
        super.leavesPlay(player);

        this.parent.removeTrait('King');
    }

    onPhaseEnded() {
        if(this.modifiedStr) {
            this.parent.strengthModifier -= this.modifiedStr;

            this.modifiedStr = 0;
        }
    }
}

CrownOfGoldenRoses.code = '04044';

module.exports = CrownOfGoldenRoses;
