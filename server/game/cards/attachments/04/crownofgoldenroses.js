const DrawCard = require('../../../drawcard.js');

class CrownOfGoldenRoses extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card to give attached character STR',
            method: 'boost',
            limit: ability.limit.perRound(2)
        });
        this.whileAttached({
            effect: ability.effects.addTrait('King')
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

        this.untilEndOfPhase(ability => ({
            match: card => card === this.parent,
            effect: ability.effects.modifyStrength(icons)
        }));

        this.game.addMessage('{0} uses {1} to discard {2} to give {3} +{4} STR', player, this, card, this.parent, icons);

        return true;
    }

    canAttach(player, card) {
        if(!card.hasTrait('Lord')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

CrownOfGoldenRoses.code = '04044';

module.exports = CrownOfGoldenRoses;
