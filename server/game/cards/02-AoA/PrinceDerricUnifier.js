const Card = require('../../Card.js');

class PrinceDerricUnifier extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => ((context.player.cardsInPlay.filter(card => card.hasHouse('brobnar')).length > 0 ? 1 : 0) + ((context.player.cardsInPlay.filter(card => card.hasHouse('dis')).length) > 0 ? 1 : 0) + ((context.player.cardsInPlay.filter(card => card.hasHouse('logos')).length) > 0 ? 1 : 0) + ((context.player.cardsInPlay.filter(card => card.hasHouse('mars')).length) > 0 ? 1 : 0) + ((context.player.cardsInPlay.filter(card => card.hasHouse('sanctum')).length) > 0 ? 1 : 0) + ((context.player.cardsInPlay.filter(card => card.hasHouse('shadows')).length) > 0 ? 1 : 0) + ((context.player.cardsInPlay.filter(card => card.hasHouse('untamed')).length) > 0 ? 1 : 0)) >= 3,
            gameAction: ability.actions.gainAmber({ amount: 3 }),
            effect: 'gain 3 amber if you control creatures from 3 different houses.'
        });
    }
}

PrinceDerricUnifier.id = 'prince-derric-unifier';

module.exports = PrinceDerricUnifier;
