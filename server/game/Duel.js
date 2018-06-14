const _ = require('underscore');

class Duel {
    constructor(game, challenger, target, type) {
        this.game = game;
        this.type = type;
        this.source = game.getFrameworkContext().source;
        this.challenger = challenger;
        this.challengerTotal = this.getSkillTotal(challenger);
        this.target = target;
        this.targetTotal = this.getSkillTotal(target);
        this.bidFinished = false;
    }

    getSkillTotal(card) {
        if(card.location === 'play area') {
            if(this.type === 'military') {
                return card.getMilitarySkill(false, this.bidFinished);
            } else if(this.type === 'political') {
                return card.getPoliticalSkill(false, this.bidFinished);
            }
        }
        return '-';
    }

    isInvolved(card) {
        return (card === this.challenger || card === this.target) && card.location === 'play area';
    }

    getTotalsForDisplay() {
        return this.challenger.name + ': ' + this.getSkillTotal(this.challenger).toString() + ' vs ' + this.getSkillTotal(this.target).toString() + ': ' + this.target.name;
    }

    modifyDuelingSkill() {
        this.bidFinished = true;
        let cards = [this.challenger, this.target].filter(card => card.location === 'play area');
        if(this.type === 'military') {
            _.each(cards, card => {
                this.source.untilEndOfDuel(ability => ({
                    match: card,
                    effect: ability.effects.modifyMilitarySkill(parseInt(card.controller.honorBid))
                }));
            });
        } else if(this.type === 'political') {
            _.each(cards, card => {
                this.source.untilEndOfDuel(ability => ({
                    match: card,
                    effect: ability.effects.modifyPoliticalSkill(parseInt(card.controller.honorBid))
                }));
            });
        }
        this.game.checkGameState();
    }

    determineResult() {
        let challengerTotal = this.getSkillTotal(this.challenger);
        let targetTotal = this.getSkillTotal(this.target);
        if(this.challengerTotal === '-') {
            if(this.targetTotal !== '-' && this.targetTotal > 0) {
                // Challenger dead, target alive
                this.winner = this.target;
            }
            // Both dead
        } else if(this.targetTotal === '-') {
            // Challenger alive, target dead
            if(this.challengerTotal > 0) {
                this.winner = this.challenger;
            }
        } else if(challengerTotal > targetTotal) {
            // Both alive, challenger wins
            this.winner = this.challenger;
            this.loser = this.target;
        } else if(challengerTotal < targetTotal) {
            // Both alive, target wins
            this.winner = this.target;
            this.loser = this.challenger;
        }
    }
}

module.exports = Duel;
