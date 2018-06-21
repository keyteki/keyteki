const _ = require('underscore');

const DrawCard = require('../../drawcard.js');
const DynastyCardAction = require('../../dynastycardaction.js');
const GameActions = require('../../GameActions/GameActions');
const ThenAbility = require('../../ThenAbility');

const backAlleyPersistentEffect = {
    apply: card => {
        // enable popup functionality
        card.showPopup = true;
        card.popupMenuText = 'Use Interrupt ability';
        // register limit which needs to be shared among all the play actions which will be added by the interrupt ability
        card.backAlleyActionLimit.registerEvents(card.game);
    },
    unapply: card => {
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

class BackAlleyPlayCharacterAction extends DynastyCardAction {
    constructor(backAlleyCard, card) {
        super(card);
        this.title = 'Play this character from Back-Alley Hideaway';
        this.limit = backAlleyCard.backAlleyActionLimit;
        this.backAlleyCard = backAlleyCard;
    }

    meetsRequirements(context = this.createContext()) {
        if(context.source.location !== 'backalley hideaway') {
            return 'location';
        }
        if(!context.source.canPlay(context) || !context.source.parent.canTriggerAbilities(context)) {
            return 'cannotTrigger';
        }
        if(!this.canPayCosts(context)) {
            return 'cost';
        }
        return '';
    }

    executeHandler(context) {
        context.game.addMessage('{0} plays {1} from {2} with {3} additional fate', context.player, context.source, context.source.parent, context.chooseFate);
        // remove this action from the card
        context.source.abilities.playActions = _.reject(context.source.abilities.playActions, action => action.title === 'Play this character from Back-Alley Hideaway');
        // remove associations between this card and Back-Alley Hideaway
        this.backAlleyCard.removeAttachment(context.source);
        context.source.parent = null;
        let putIntoPlayEvent = GameActions.putIntoPlay({ fate: context.chooseFate }).getEvent(context.source, context);
        let cardPlayedEvent = context.game.getEvent('onCardPlayed', { player: context.player, card: context.source, originalLocation: 'backalley hideaway' });
        let window = context.game.openEventWindow([putIntoPlayEvent, cardPlayedEvent]);
        window.addThenAbility([putIntoPlayEvent], new ThenAbility(context.game, this.backAlleyCard, { gameAction: GameActions.sacrifice({ target: this.backAlleyCard }) }));
    }

    isCardAbility() {
        return true;
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
            effect: ability.effects.customDetachedCard(backAlleyPersistentEffect)
        });
        this.interrupt({
            title: 'Place character in Hideaway',
            when: {
                onCardLeavesPlay: (event, context) => event.card.isFaction('scorpion') && event.card.type === 'character' &&
                                                      event.card.controller === context.player
            },
            effect: 'move {0} into hiding',
            handler: context => context.event.replaceHandler(event => {
                context.player.removeCardFromPile(event.card);
                event.card.leavesPlay();
                event.card.moveTo('backalley hideaway');
                context.source.attachments.push(event.card);
                event.card.parent = context.source;
                event.card.abilities.playActions.push(new BackAlleyPlayCharacterAction(context.source, event.card));
            })
        });
    }
}

BackAlleyHideaway.id = 'back-alley-hideaway';

module.exports = BackAlleyHideaway;
