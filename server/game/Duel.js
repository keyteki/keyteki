class Duel {
    constructor(game, challenger, target, getSkill) {
        this.game = game;
        this.challenger = challenger;
        this.challengerTotal = getSkill(challenger);
        this.target = target;
        this.targetTotal = getSkill(target);
        this.getSkill = getSkill;
        this.bidFinished = false;
    }

    getSkillTotal(card) {
        this.game.reapplyStateDependentEffects();
        return this.getSkill(card) + (this.bidFinished ? parseInt(card.controller.honorBid) : 0);
    }

    isInvolved(card) {
        return card === this.challenger || card === this.target;
    }

    getTotalsForDisplay() {
        return this.challenger.name + ': ' + this.getSkillTotal(this.challenger).toString() + ' vs ' + this.getSkillTotal(this.target).toString() + ': ' + this.target.name;
    }

    setBidFinished() {
        this.bidFinished = true;
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
