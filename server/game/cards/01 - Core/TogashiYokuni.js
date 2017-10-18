const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class TogashiYokuni extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Copy another card\'s ability',
            max: ability.limit.perRound(1),
            target: {
                activePromptTitle: 'Select a character',
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && _.any(card.abilities.actions.concat(card.abilities.reactions), ability => ability.printedAbility)
            },
            handler: (context) => {
                let abilities = _.filter(context.target.abilities.actions.concat(context.target.abilities.reactions), ability => ability.printedAbility);
                //let choices = _.map(abilities, ability => ability.title);
                let handlers = _.map(abilities, a => {
                    return () => {
                        if(a.methods) {
                            _.each(a.methods, name => this[name] = context.target[name].bind(this));
                        }
                        context.target.setupCardAbilities.call(this, ability);
                        // TODO: add code to remove any other non-chosen abilities
                        let newAbility = _.find(context.target.abilities.actions.concat(context.target.abilities.reactions), ability => ability.title === a.title);
                        newAbility.registerEvents();
                        this.untilEndOfPhase(ability => ({
                            match: this,
                            effect: ability.effects.removeAbility(newAbility)
                        }));
                    };
                });
                handlers[0]();
                /*
                this.game.promptWithHandlerMenu(this.controller, {
                    activePromptTitle: 'Choose an ability',
                    source: this,
                    choices: choices,
                    handlers: handlers
                });
                */
            }
        });
    }
}

TogashiYokuni.id = 'togashi-yokuni';

module.exports = TogashiYokuni;

