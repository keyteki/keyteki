const DrawCard = require('../../drawcard.js');

class KabukiHero extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain military bonus',
            cost: ability.costs.payFate(1),
            condtion: () => this.game.currentConflict,
            handler: () => {
                let polSkill = this.getPoliticalSkill();
                this.game.addMessage('{0} uses {1} to give itself +{2}/+0 until the end of the conflict', this.controller, this, polSkill);
                this.untilEndOfConflict(ability => ({
                    match: this,
                    effect: ability.effects.modifyMilitarySkill(polSkill)
                }));
            }
        });
    }
}

KabukiHero.id = 'kabuki-hero';

module.exports = KabukiHero;
