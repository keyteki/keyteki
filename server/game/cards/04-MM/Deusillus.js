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
                    this.controller.removeCardFromPile(part);                    
                    // TODO enhance Any persistent effect that has location: 'play area' should only be implemented in part 1 of a gigantic card
                    part.moveTo('play area'); 
                    this.playedParts.push(part);
                }
            });

            // TODO can we do better?
            this.image = 'deusillus-complete';
        }

        if(originalLocation === 'play area') {
            this.playedParts.forEach(part => {
                this.controller.moveCard(part, targetLocation);
            });
            this.playedParts = [];
            this.image = this.id;
        }
    }
}

Deusillus.id = 'deusillus';

module.exports = Deusillus;
