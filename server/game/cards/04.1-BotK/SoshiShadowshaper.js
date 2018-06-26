const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');

class SoshiShadowshaper extends DrawCard {
    setupCardAbilities(ability) {
        this.charactersPlayedThisPhase = [];
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onPhaseStarted', 'onCharacterEntersPlay']);

        this.action({
            title: 'Return a character to owner\'s hand',
            phase: 'conflict',
            cost: ability.costs.payHonor(1),
            target: {
                cardType: 'character',
                cardCondition: card => card.getCost() <= 2 && this.charactersPlayedThisPhase.includes(card),
                gameAction: ability.actions.returnToHand()
            }
        });
    }

    onPhaseStarted() {
        this.charactersPlayedThisPhase = [];
    }

    onCharacterEntersPlay(event) {
        if(event.originalLocation === 'hand') {
            this.charactersPlayedThisPhase.push(event.card);
        }
    }
}

SoshiShadowshaper.id = 'soshi-shadowshaper';

module.exports = SoshiShadowshaper;
