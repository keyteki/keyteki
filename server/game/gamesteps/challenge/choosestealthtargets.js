const BaseStep = require('../basestep.js');

class ChooseStealthTargets extends BaseStep {
    constructor(game, challenge, stealthCharacters) {
        super(game);
        this.challenge = challenge;
        this.stealthCharacters = stealthCharacters;
    }

    continue() {
        if(this.stealthCharacters.length > 0) {
            var character = this.stealthCharacters.shift();
            this.game.promptForSelect(character.controller, {
                activePromptTitle: 'Select stealth target for ' + character.name,
                waitingPromptTitle: 'Waiting for opponent to choose stealth target for ' + character.name,
                cardCondition: card => card.controller === this.challenge.defendingPlayer && card.getType() === 'character' && character.canUseStealthToBypass(card),
                onSelect: (player, target) => this.selectStealthTarget(character, target)
            });
        }

        return this.stealthCharacters.length === 0;
    }

    selectStealthTarget(character, target) {
        if(!character.useStealthToBypass(target)) {
            return false;
        }

        this.game.addMessage('{0} has chosen {1} as the stealth target for {2}', this.challenge.attackingPlayer, target, character);

        this.game.raiseEvent('onBypassedByStealth', this.challenge, character, target);

        return true;
    }
}

module.exports = ChooseStealthTargets;
