const DrawCard = require('../../drawcard.js');

class KakitaBlade extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.game.currentDuel && this.game.currentDuel.isInvolved(this.parent),
            effect: ability.effects.modifyPoliticalSkill(2)
        });
        this.reaction({
            title: 'Gain honor on duel win',
            when:{
                onDuelResolution: event => event.duel.winner === this.parent
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to gain 1 honor', this.controller, this);
                this.game.addHonor(this.controller, 1);
            }
        })
    }
}

KakitaBlade.id = 'kakita-blade';

module.exports = KakitaBlade;
