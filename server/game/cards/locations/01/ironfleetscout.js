const DrawCard = require('../../../drawcard.js');

class IronFleetScout extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel this card to give a character +1 STR',
            method: 'kneel'
        });
    }

    kneel(player) {
        if(this.location !== 'play area' || !this.game.currentChallenge || this.kneeled) {
            return false;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character to gain STR',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area' && this.game.currentChallenge.isParticipating(card) && card.isFaction('greyjoy');
    }

    onCardSelected(player, card) {
        var strength = player.firstPlayer ? 2 : 1;
        player.kneelCard(this);
        this.game.addMessage('{0} kneels {1} to give {2} +{3} STR until the end of the challenge', player, this, card, strength);
        this.untilEndOfChallenge(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(strength)
        }));

        return true;
    }
}

IronFleetScout.code = '01079';

module.exports = IronFleetScout;
