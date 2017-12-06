const _ = require('underscore');
const EffectSource = require('./EffectSource.js');

class Duel {
    constructor(game, challenger, target, type) {
        this.game = game;
        this.source = new EffectSource(game);
        this.challenger = challenger;
        this.challengerTotal = this.getSkillTotal(challenger);
        this.target = target;
        this.targetTotal = this.getSkillTotal(target);
        this.type = type;
        this.bidFinished = false;
    }

    getSkillTotal(card) {
        if(this.type === 'military') {
            return card.getMilitarySkill(false, this.bidFinished);
        } else if(this.type === 'political') {
            return card.getPoliticalSkill(false, this.bidFinished);
        }
        return null;
    }

    isInvolved(card) {
        return card === this.challenger || card === this.target;
    }

    getTotalsForDisplay() {
        this.game.reapplyStateDependentEffects();
        return this.challenger.name + ': ' + this.getSkillTotal(this.challenger).toString() + ' vs ' + this.getSkillTotal(this.target).toString() + ': ' + this.target.name;
    }

    modifyDuelingSkill() {
        this.bidFinished = true;
        if(this.type === 'military') {
            _.each([this.challenger, this.target], card => {
                this.source.untilEndOfDuel(ability => ({
                    match: card,
                    effect: ability.effects.modifyMilitarySkill(parseInt(card.controller.honorBid))
                }));
            });
        } else if(this.type === 'political') {
            _.each([this.challenger, this.target], card => {
                this.source.untilEndOfDuel(ability => ({
                    match: card,
                    effect: ability.effects.modifyPoliticalSkill(parseInt(card.controller.honorBid))
                }));
            });
        }
    }

    determineResult() {
        let challengerTotal = this.getSkillTotal(this.challenger);
        let targetTotal = this.getSkillTotal(this.target);
        if(challengerTotal > targetTotal) {
            this.winner = this.challenger;
            this.loser = this.target;
        } else if(challengerTotal < targetTotal) {
            this.winner = this.target;
            this.loser = this.challenger;
        }
    }
}

module.exports = Duel;
