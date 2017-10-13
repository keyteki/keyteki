const _ = require('underscore');

const DrawCard = require('../../drawcard.js');

class Rout extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose a character – send it home.',
            condition: () => this.game.currentConflict && this.hasBushiPresent(),
            target: {
                activePromptTitle: 'Select a character',
                cardType: 'character',
                gameAction: 'sendHome',
                cardCondition: card => card.location === 'play area' && this.game.currentConflict.isParticipating(card) && card.controller !== this.controller && card.getMilitarySkill() < this.getStrongestBushi()
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to send {2} home', this.controller, this, context.target);
                this.game.currentConflict.sendHome(context.target);
            }
        });
    }

    hasBushiPresent() {
        if(this.game.currentConflict.attackingPlayer === this.controller) {
            let present = _.size(_.filter(this.game.currentConflict.attackers, card => card.hasTrait('bushi')));
            if(present > 0) {
                return true;
            }
        }
        if(this.game.currentConflict.defendingPlayer === this.controller) {
            let present = _.size(_.filter(this.game.currentConflict.attackers, card => card.hasTrait('bushi')));
            if(present > 0) {
                return true;
            }
        }
        return false;
    }

    getStrongestBushi() {
        if(this.game.currentConflict.attackingPlayer === this.controller) {
            let characters = _.filter(this.game.currentConflict.attackers, card => card.hasTrait('bushi'));
            let highestSkilledCharacter = _.max(characters, function(character) {
                return character.getMilitarySkill();
            });
            return highestSkilledCharacter.getMilitarySkill();
        }
        if(this.game.currentConflict.defendingPlayer === this.controller) {
            let characters = _.filter(this.game.currentConflict.attackers, card => card.hasTrait('bushi'));
            let highestSkilledCharacter = _.max(characters, function(character) {
                return character.getMilitarySkill();
            });
            return highestSkilledCharacter.getMilitarySkill();
        }
    }
}

Rout.id = 'rout';

module.exports = Rout;
