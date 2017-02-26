const DrawCard = require('../../../drawcard.js');

class RobbStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'military'
            ),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.numberOfLoyalChars())
        });

        this.action({
            title: 'Stand and remove a character from the challenge',
            method: 'initiate',
            limit: ability.limit.perChallenge(1)
        });
    }

    initiate(player) {
        if(!this.game.currentChallenge || !this.game.currentChallenge.challengeType === 'military' || !this.game.currentChallenge.isParticipating(this)) {
            return false;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => (
                card.location === 'play area' && 
                card.getType() === 'character' && 
                !card.hasTrait('King') &&
                this.game.currentChallenge.isParticipating(card)),
            activePromptTitle: 'Select character to stand and remove',
            source: this,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    onCardSelected(player, card) {
        card.controller.standCard(card);
        this.game.currentChallenge.removeFromChallenge(card);

        this.game.addMessage('{0} uses {1} to stand {2} and remove them from the challenge', player, this, card);

        return true;
    }

    numberOfLoyalChars () {
        var cards = this.controller.cardsInPlay.filter(card => {
            return card.isLoyal() && card.getType() === 'character';
        });

        return cards.length;
    }
}

RobbStark.code = '04002';

module.exports = RobbStark;
