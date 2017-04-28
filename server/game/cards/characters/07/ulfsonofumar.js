const DrawCard = require('../../../drawcard.js');

class UlfSonOfUmar extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: event => {
                    let card = event.card;
                    if(!card.hasTrait('Clansman') || card.getType() !== 'character' || card.controller !== this.controller || card.getStrength(true) === 0) {
                        return false;
                    }

                    this.strBoost = card.getStrength(true);
                    return true;
                }             
            },
            limit: ability.limit.perPhase(3),
            handler: () => {
                this.untilEndOfPhase(ability => ({
                    match: this,
                    effect: ability.effects.modifyStrength(this.strBoost)
                }));        

                this.game.addMessage('{0} uses {1} to give {1} +{2} STR until the end of the phase', 
                                      this.controller, this, this.strBoost);
            }
        });
    }
}

UlfSonOfUmar.code = '07029';

module.exports = UlfSonOfUmar;
