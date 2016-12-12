const DrawCard = require('../../../drawcard.js');
 
class WildlingHorde extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.menu.push({ text: 'Kneel your faction card', command: 'card', method: 'kneelFactionCard' });

        this.registerEvents(['afterChallenge']);
    }

    kneelFactionCard(player) {
        if(!this.inPlay || this.controller !== player || player.faction.kneeled) {
            return;
        }

        if(player.phase !== 'challenge' || !this.game.currentChallenge) {
            return;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a Wildling character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.inPlay && card.controller === player && card.hasTrait('Wildling') && player.isCardUuidInList(player.cardsInChallenge, card.uuid),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
    }

    onCardSelected(player, card) {
        if(!this.inPlay || this.controller !== player) {
            return;
        }

        player.faction.kneeled = true;
        this.cardInEffect = card;
        card.strengthModifier += 2;

        this.game.addMessage('{0} uses {1} to kneel their faction card and increase the strength of {2} by 2 until the end of the challenge', player, this, card);
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
