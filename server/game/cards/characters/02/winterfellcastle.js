const DrawCard = require('../../../drawcard.js');

class WinterfellCastle extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.hasParticipatingUniqueStarks(),
            match: card => this.isUniqueStark(card) && this.game.currentChallenge.isParticipating(card),
            effect: ability.effects.modifyStrength(2)
        });
    }

    hasParticipatingUniqueStarks() {
        let challenge = this.game.currentChallenge;
        return (
            challenge &&
            ['military', 'power'].includes(challenge.challengeType) &&
            challenge.getNumberOfParticipants(card => this.isUniqueStark(card)) >= 2
        );
    }

    isUniqueStark(card) {
        return card.controller === this.controller && card.getType() === 'character' && card.isUnique() && card.isFaction('stark');
    }
}

WinterfellCastle.code = '02022';

module.exports = WinterfellCastle;
