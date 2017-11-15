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
            handler: (context) => {
                let abilities = _.filter(context.target.abilities.actions.concat(context.target.abilities.reactions), ability => ability.printedAbility && ability.title !== 'Copy another character\'s ability');
                if(abilities.length === 0) {
                    return;
                }
                //let choices = _.map(abilities, ability => ability.title);
                let handlers = _.map(abilities, a => {
                    return () => {
                        this.game.addMessage('{0} uses {1} to gain {2}\'s \'{3}\' ability', this.controller, this, context.target, a.title);
                        // Check to see if the ability we're copying needs any methods on the target card, and if so, bind them to this card
                        if(a.methods) {
                            _.each(a.methods, name => this[name] = context.target[name].bind(this));
                        }
                        // Call the target cards setupCardAbilities on this card - this will create all its abilities on this card
                        context.target.setupCardAbilities.call(this, ability);
                        // Find the created ability that we need
                        let newAbility = _.find(this.abilities.actions.concat(this.abilities.reactions), ability => ability.title === a.title && ability.printedAbility);
                        // The new ability will have incorrect maxIdentifiers, because it will create new ones as if those abilities were printed on this card. We need to give it
                        // correct ones, and then register that max
                        if(newAbility.max) {
                            newAbility.abilityIdentifier = a.abilityIdentifier;
                            newAbility.maxIdentifier = this.name + newAbility.abilityIdentifier;
                            this.controller.registerAbilityMax(newAbility.maxIdentifier, newAbility.max);
                        }
                        // Register any events which the new ability has
                        newAbility.registerEvents();
                        newAbility.printedAbility = false;
                        // Get rid of any other abilities which might have been copied that we don't want (making sure we don't delete this ability)
                        this.abilities.actions = _.reject(this.abilities.actions, action => action.cannotBeCopied);
                        this.abilities.actions = _.reject(this.abilities.actions, action => action.printedAbility && action.title !== 'Copy another character\'s ability');
                        this.abilities.reactions = _.reject(this.abilities.reactions, reaction => reaction.printedAbility);
                        // Add an effect to delete this ability and its methods and unregister all its events at the end of the phase
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

