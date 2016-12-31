const DrawCard = require('../../../drawcard.js');

class WildlingHorde extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    setupCardAbilities() {
      this.action({
          title: 'Kneel your faction card',
          method: 'kneelFactionCard',
          phase: 'challenge'
      });
    }

    cardCondition(player, card) {
        var currentChallenge = this.game.currentChallenge;
        if(!currentChallenge) {
            return false;
        }

        return card.location === 'play area' && card.controller === player && card.hasTrait('Wildling') && currentChallenge.isAttacking(card);
    }

    kneelFactionCard(player) {
        if(player.faction.kneeled) {
            return false;
        }

        if(!this.game.currentChallenge) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a Wildling character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => this.cardCondition(player, card),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        if(this.controller !== player) {
            return false;
        }

        player.faction.kneeled = true;
        this.cardInEffect = card;
        card.strengthModifier += 2;

        this.game.addMessage('{0} uses {1} to kneel their faction card and increase the strength of {2} by 2 until the end of the challenge', player, this, card);

        return true;
    }

    afterChallenge() {
        if(!this.cardInEffect) {
            return;
        }

        this.cardInEffect.strengthModifier -= 2;
        this.cardInEffect = undefined;
    }
}

WildlingHorde.code = '01031';

module.exports = WildlingHorde;
