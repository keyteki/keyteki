const _ = require('underscore');

const BaseStep = require('../basestep.js');

class ChooseStealthTargets extends BaseStep {
    constructor(game, challenge, stealthCharacters) {
        super(game);
        this.challenge = challenge;
        this.stealthCharacters = stealthCharacters;
    }

    continue() {
        if(this.stealthCharacters.length > 0) {
            let character = this.stealthCharacters.shift();
            let title = character.stealthLimit === 1 ? 'Select stealth target for ' + character.name : 'Select up to ' + character.stealthLimit + ' stealth targets for ' + character.name;
            this.game.promptForSelect(character.controller, {
                numCards: character.stealthLimit,
                activePromptTitle: title,
                waitingPromptTitle: 'Waiting for opponent to choose stealth target for ' + character.name,
                cardCondition: card => card.controller === this.challenge.defendingPlayer && card.getType() === 'character' && character.canUseStealthToBypass(card),
                onSelect: (player, target) => this.selectStealthTarget(character, target)
            });
        }

        return this.stealthCharacters.length === 0;
    }

    selectStealthTarget(character, targets) {
        if(!_.isArray(targets)) {
            targets = [targets];
        }
        _.each(targets, target => {
            if(!character.useStealthToBypass(target)) {
                return false;
            }

            this.game.raiseEvent('onBypassedByStealth', this.challenge, character, target);
        });

        this.game.addMessage('{0} has chosen {1} as the stealth target for {2}', this.challenge.attackingPlayer, targets, character);

        return true;
    }
}

module.exports = ChooseStealthTargets;
