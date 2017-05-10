const DrawCard = require('../../../drawcard.js');

class BalonGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);

                return !otherPlayer ||
                    (this.game.currentChallenge &&
                    this.game.currentChallenge.challengeType === 'military' &&
                    !otherPlayer.anyCardsInPlay(card => card.hasTrait('King')));
            },
            match: this,
            effect: [
                ability.effects.doesNotKneelAsAttacker()
            ]
        });

        this.action({
            title: 'Kneel a greyjoy location',
            cost: ability.costs.kneel(card => card.isFaction('greyjoy') && card.getType() === 'location'),
            handler: () => {
                this.untilEndOfChallenge(ability => ({
                    match: card => card.isLoyal() && card.controller === this.controller && card.getType() === 'character',
                    effect: ability.effects.modifyStrength(1)
                }));
            }
        });
    }
}

BalonGreyjoy.code = '04031';

module.exports = BalonGreyjoy;
