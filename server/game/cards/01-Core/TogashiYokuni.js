const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class TogashiYokuni extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Copy another character\'s ability', //need to protect this title
            max: ability.limit.perRound(1),
            target: {
                activePromptTitle: 'Select a character to copy from',
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card !== this && _.any(card.abilities.actions.concat(card.abilities.reactions), ability => ability.printedAbility)
            },
            doesNotTarget: true, // TODO: this solution works as long as no card which has both 'targeting targets' and 'non-targeting targets' is printed.  If that happens, we probably should backport throneteki ResolvedTargets
            handler: (context) => {
                let abilities = _.filter(context.target.abilities.actions.concat(context.target.abilities.reactions), ability => ability.printedAbility && ability.title !== 'Copy another character\'s ability');
                if(abilities.length === 0) {
                    return;
                }
                //let choices = _.map(abilities, ability => ability.title);
                let handlers = _.map(abilities, a => {
                    return () => {
                        this.game.addMessage('{0} uses {1} to gain {2}\'s \'{3}\' ability', this.controller, this, context.target, a.title);
                        if(a.methods) {
                            _.each(a.methods, name => this[name] = context.target[name].bind(this));
                        }
                        context.target.setupCardAbilities.call(this, ability);
                        let newAbility = _.find(this.abilities.actions.concat(this.abilities.reactions), ability => ability.title === a.title && ability.printedAbility);
                        newAbility.registerEvents();
                        newAbility.printedAbility = false;
                        this.abilities.actions = _.reject(this.abilities.actions, action => action.cannotBeCopied);
                        this.abilities.actions = _.reject(this.abilities.actions, action => action.printedAbility && action.title !== 'Copy another character\'s ability');
                        this.abilities.reactions = _.reject(this.abilities.reactions, reaction => reaction.printedAbility);
                        this.untilEndOfPhase(ability => ({
                            match: this,
                            effect: this.abilities.actions.includes(newAbility) ? ability.effects.removeAction(newAbility) : ability.effects.removeReaction(newAbility)
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

