const DrawCard = require('../../drawcard.js');

class TaintedHero extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.persistentEffect({
            match: this,
            effect: [
                ability.effects.cardCannot('declareAsAttacker'),
                ability.effects.cardCannot('declareAsDefender')
            ]
        });

        this.action({
            title: 'Make text box blank',
            cost: ability.costs.sacrifice(card => card.getType() === 'character'),
            gameAction: ability.actions.cardLastingEffect({
                match: this,
                duration: 'untilEndOfPhase',
                effect: ability.effects.blank()
            })
        });
    }
}

TaintedHero.id = 'tainted-hero';

module.exports = TaintedHero;
