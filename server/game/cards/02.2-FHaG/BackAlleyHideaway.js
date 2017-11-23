const _ = require('underscore');

const Costs = require('../../costs.js');
const DrawCard = require('../../drawcard.js');
const DynastyCardAction = require('../../dynastycardaction.js');

const backAlleyPersistentEffect = function() {
    return {
        apply: function(card) {
            // enable popup functionality
            card.showPopup = true;
            card.popupMenuText = 'Use Interrupt ability';
            // register limit which needs to be shared among all the play actions which will be added by the interrupt ability
            card.backAlleyActionLimit.registerEvents(card.game);
        },
        reapply: function(card) {
            // enable popup functionality
            card.showPopup = true;
            card.popupMenuText = 'Use Interrupt ability';            
        },
        unapply: function(card) {
            card.attachments.each(character => {
                // move all attachments to the correct discard pile
                character.owner.moveCard(character, character.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
                // remove any added playActions
                character.abilities.playActions = _.reject(character.abilities.playActions, action => action.title === 'Play this character from Back-Alley Hideaway');
            });
            // disable popup functionality
            card.showPopup = false;
            card.popupMenuText = '';
            // reset and unregister limit
            card.backAlleyActionLimit.reset();
            card.backAlleyActionLimit.unregisterEvents(card.game);
        }
    };
};

class BackAlleyPlayCharacterAction extends DynastyCardAction {
    constructor(backAlleyCard) {
        super();
        this.title = 'Play this character from Back-Alley Hideaway';
        this.limit = backAlleyCard.backAlleyActionLimit;
        this.backAlleyCard = backAlleyCard;
        this.cost.push(Costs.useLimit());
    }

    meetsRequirements(context) {
        return (
            context.source.location === 'backalley hideaway' &&
            context.player.canPutIntoPlay(context.source) &&
            context.source.canPlay() &&
            this.canPayCosts(context)
        );
    }

    executeHandler(context) {
        context.game.addMessage('{0} plays {1} from {2} with {3} additional fate', context.player, context.source, context.source.parent, context.chooseFate);
        // remove this action from the card
        context.source.abilities.playActions = _.reject(context.source.abilities.playActions, action => action.title === 'Play this character from Back-Alley Hideaway');
        // remove associations between this card and Back-Alley Hideaway
        this.backAlleyCard.removeAttachment(context.source);
        context.source.parent = null;
        context.source.fate = context.chooseFate;
        context.player.putIntoPlay(context.source, false, true);
        // TODO: create a proper ThenEffect for this
        context.game.queueSimpleStep(() => context.player.sacrificeCard(this.backAlleyCard));
    }
}

class BackAlleyHideaway extends DrawCard {
    setupCardAbilities(ability) {
        this.backAlleyActionLimit = ability.limit.perRound(1);
        this.persistentEffect({
            location: 'any',
            targetLocation: 'province',
            condition: () => !this.facedown,
            match: this,
            effect: backAlleyPersistentEffect()
        });
        this.interrupt({
            title: 'Place character in Hideaway',
            when: {
                onCardLeavesPlay: event => event.card.controller === this.controller && event.card.isFaction('scorpion')
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to move {2} into hiding', this.controller, this, context.event.card);
                context.event.replaceHandler(event => {
                    event.cardStateWhenLeftPlay.leavesPlayEffects();
                    this.controller.removeCardFromPile(event.card);
                    event.card.leavesPlay();
                    event.card.moveTo('backalley hideaway');
                    this.attachments.push(event.card);
                    event.card.parent = this;
                    event.card.abilities.playActions.push(new BackAlleyPlayCharacterAction(this));
                    return { resolved: true, success: true };
                });
            }
        });
    }
}

BackAlleyHideaway.id = 'back-alley-hideaway';

module.exports = BackAlleyHideaway;
