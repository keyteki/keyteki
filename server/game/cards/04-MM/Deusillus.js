const Card = require('../../Card.js');

class Deusillus extends Card {
    constructor(owner, cardData) {
        super(owner, cardData);
        // TODO This could be temporary - depends if the final JSON will contain this info or not
        // I added this to help 'It's Coming...'
        this.gigantic = true;
        this.playedParts = [];
    }

    get compositeParts() {
        return ['deusillus-2'];
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            match: this,
            effect: ability.effects.cardCannot('play', context => {
                return context.source.location !== 'hand' ||
                    this.compositeParts.some(id => !context.source.controller.hand.some(card => id === card.id));
            })
        });

        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.capture(context => ({
                    amount: context.player.opponent ? context.player.opponent.amber : 0
                })),
                ability.actions.dealDamage({
                    amount: 5,
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature',
                        cardType: 'creature',
                        controller: 'opponent'
                    }
                })
            ])
        });

        this.fight({
            reap: true,
            gameAction: ability.actions.sequential([
                ability.actions.removeAmber(),
                ability.actions.dealDamage(context => ({
                    amount: 2,
                    target: context.player.opponent && context.player.opponent.creaturesInPlay
                }))
            ])
        });
    }

    moveTo(targetLocation) {
        let originalLocation = this.location;
        super.moveTo(targetLocation);

        if((originalLocation === 'hand') && (targetLocation === 'play area')) {
            this.compositeParts.forEach(id => {
                let part = this.controller.hand.find(card => id === card.id);
                if(part) {
                    part.moveTo('play area'); // TODO if not here, when we remove it from play, it tries to removeEffects
                    // TODO this is a problem because we are applying effects twice (work on it)
                    // this.controller.removeCardFromPile(part);
                    this.playedParts.push(part);
                }
            });
        }

        if(originalLocation === 'play area') {
            this.playedParts.forEach(part => {
                this.controller.moveCard(part, targetLocation);
            });
            this.playedParts = [];
        }
    }
}

Deusillus.id = 'deusillus';

module.exports = Deusillus;
