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
        unapply: function(card) {
            card.attachments.each(c => {
                // move all attachments to the correct discard pile
                c.owner.moveCard(c, c.isDynasty ? 'dynasty discard pile' : 'conflict discard pile');
                // remove any added playActions
                c.abilities.playActions = _.reject(c.abilities.playActions, action => action.title === 'Play this character from Back-Alley Hideaway');
            });
            // disable popup functionality
            card.showPopup = false;
            card.popupMenuText = '';
            // reset and unregister limit
            this.backAlleyActionLimit.reset();
            this.backAlleyActionLimit.unregisterEvents(card.game);
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
        context.source.fate = context.chooseFate;
        context.player.putIntoPlay(context.source, false, true);
        // remove this action from the card
        context.source.ability.playActions = _.reject(context.source.abilities.playActions, action => action.title === 'Play this character from Back-Alley Hideaway');
        // TODO: create a proper ThenEffect for this
        context.player.sacrificeCard(this.backAlleyCard);
    }
}

class BackAlleyHideaway extends DrawCard {
    setupCardAbilities(ability) {
        this.backAlleyActionLimit = ability.limit.perRound(1);
        this.persistentEffect({
            location: 'any',
            targetLocation: 'province',
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
