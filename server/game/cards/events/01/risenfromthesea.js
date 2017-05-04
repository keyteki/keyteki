const DrawCard = require('../../../drawcard.js');

class RisenFromTheSea extends DrawCard {
    canPlay() {
        return false;
    }

    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave
            },
            location: 'hand',
            target: {
                activePromptTitle: 'Select character to save',
                cardCondition: (card, context) => context.event.cards.includes(card) && card.isFaction('greyjoy') && card.controller === this.controller
            },
            handler: context => {
                context.event.saveCard(context.target);
                this.controller.attach(this.controller, this, context.target.uuid, 'play');
                
                this.game.addMessage('{0} plays {1} to save {2}', this.controller, this, context.target);
            }
        });
        
        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });

        this.persistentEffect({
            condition: () => !!this.parent,
            match: this,
            effect: [
                ability.effects.addKeyword('Terminal'),
                ability.effects.addTrait('Condition')
            ]
        });
    }
}

RisenFromTheSea.code = '01081';

module.exports = RisenFromTheSea;
