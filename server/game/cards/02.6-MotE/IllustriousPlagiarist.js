const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class IllustriousPlagiarist extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Copy action abilty of opponent\'s top event',
            condition: () => this.controller.opponent,
            target: {
                cardCondition: card => card === this.controller.opponent.conflictDiscardPile.find(card => card.type === 'event') && card.abilities.actions.length > 0
            },
            handler: context => {
                // We going to need to know the abilityIdentifier for copied actions later
                let abilityIdentifiers = {};
                _.each(context.target.abilities.actions, action => {
                    abilityIdentifiers[action.title] = action.abilityIdentifier;
                });
                // This is so we know which actions have been added, and which will need removing
                let actionTitles = _.keys(abilityIdentifiers);
                let reactionTitles = _.pluck(context.target.abilities.reactions, 'title');
                this.game.addMessage('{0} uses {1} to copy {2} from {3}', this.controller, this, actionTitles, context.target);
                _.each(context.target.abilities.actions, action => {
                    // Check to see if the abilities we're copying needs any methods on the target card, and if so, bind them to this card
                    if(action.methods) {
                        _.each(action.methods, name => this[name] = context.target[name].bind(this));
                    }
                });
                // Call the target cards setupCardAbilities on this card - this will create all its abilities on this card
                context.target.setupCardAbilities.call(this, ability);
                // Remove any reactions which might have been created
                this.abilities.reactions = _.reject(this.abilities.reactions, reaction => reactionTitles.includes(reaction.title) && reaction.printedAbility);
                _.each(this.abilities.actions, action => {
                    // For each action which has just been added:
                    if(action.printedAbility && actionTitles.includes(action.title)) {
                        // If it has a max, create the correct identifier, then register it with this player
                        if(action.max) {
                            action.abilityIdentifier = abilityIdentifiers[action.title];
                            action.maxIdentifier = this.name + action.abilityIdentifier;
                            this.controller.registerAbilityMax(action.maxIdentifier, action.max);
                        }
                        // Mark it as non-printed, and add a lasting effect to remove it at the end of the phase
                        action.printedAbility = false;
                        this.untilEndOfPhase(ability => ({
                            match: this,
                            effect: ability.effects.removeAction(action)
                        }));
                    }
                });
            }
        });
    }
}

IllustriousPlagiarist.id = 'illustrious-plagiarist';

module.exports = IllustriousPlagiarist;
