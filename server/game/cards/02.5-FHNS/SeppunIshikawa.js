const DrawCard = require('../../drawcard.js');
const _ = require('underscore');

class SeppunIshikawa extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            recalculateWhen: ['onMove', 'onPlayIntoConflict', 'onCardTraitChanged', 'onCardEntersPlay', 'onProvinceRevealed', 'onCardTakenControl', 'onCardLeavesPlay', 'onCardSacrificed', 'onCardAttached', 'onBreakProvince'],
            effect: [
                ability.effects.dynamicMilitarySkill(() => this.getImperialCardsInPlay()),
                ability.effects.dynamicPoliticalSkill(() => this.getImperialCardsInPlay())
            ]
        });
    }

    getImperialCardsInPlay() {
        if(this.controller && this.controller.cardsInPlay) {
            return _.reduce(_.flatten([this.controller.cardsInPlay._wrapped, this.getProvinces()]), (sum, card) => {
                if(card.hasTrait('imperial')) {
                    return sum + 1;
                }
                return sum;
            }, -1);
        }
        return 0;
    }

    getProvinces() {
        let provinces = _.map(['province 1', 'province 2', 'province 3', 'province 4'], location => {
            return this.controller.getProvinceCardInProvince(location);
        });
        return _.filter(provinces, province => {
            return !province.isBroken && !province.facedown;
        });
    }
}

SeppunIshikawa.id = 'seppun-ishikawa';

module.exports = SeppunIshikawa;
