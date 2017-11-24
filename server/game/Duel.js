class Duel {
    constructor(game, challenger, target, type) {
        this.game = game;
        this.challenger = challenger;
        this.challengerTotal = this.getSkillTotal(challenger);
        this.target = target;
        this.targetTotal = this.getSkillTotal(target);
        this.type = type;
        this.bidFinished = false;
    }

    getSkillTotal(card) {
        if(this.type === 'military') {
            return card.getMillitarySkill(false, this.bidFinished) + (this.bidFinished ? parseInt(card.controller.honorBid) : 0);
        } else if(this.type === 'political') {
            return card.getPoliticalSkill(false, this.bidFinished) + (this.bidFinished ? parseInt(card.controller.honorBid) : 0);
        }
        return null;
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
