const _ = require('underscore');

const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');
const PlayCharacterAction = require('../../playcharacteraction.js');
const EventRegistrar = require('../../eventregistrar.js');

class AcademyPlayAttachmentAction extends PlayAttachmentAction {
    constructor() {
        super();
        this.location = ['conflict deck'];
    }
}

class AcademyPlayCharacterAction extends PlayCharacterAction {
    constructor() {
        super();
        this.location = ['conflict deck'];
    }
}

class ArtisanAcademy extends DrawCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.action({
            title: 'Draw a card',
            phase: 'conflict',
            condition: () => this.controller.conflictDeck.size() > 0,
            handler: () => {
                this.topCard = this.controller.conflictDeck.first();
                this.game.addMessage('{0} uses {1} to reveal the top card of their conflict deck: {2}', this.controller, this, this.topCard);
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    effect: ability.effects.revealTopCardOfConflictDeck()
                }));
                this.eventRegistrar.register(['onCardMoved', 'onPhaseEnded', 'onDeckShuffled']);
                _.each(this.topCard.abilities.playActions, action => {
                    if(action.location && action.location.includes('hand')) {
                        let clonedAction = _.clone(action);
                        clonedAction.location = ['conflict deck'];
                        this.topCard.abilities.platActions.push(clonedAction);
                    }
                });
                if(this.topCard.type === 'event') {
                    _.each(this.topCard.abilities.actions, action => {
                        action.location.push('conflict deck');
                        action.registerEvents();
                    });
                    _.each(this.topCard.abilities.reactions, reaction => {
                        reaction.location.push('conflict deck');
                        reaction.registerEvents();
                    });
                } else if(this.topCard.type === 'attachment') {
                    this.topCard.abilities.playActions.push(new AcademyPlayAttachmentAction());
                } else if(this.topCard.type === 'character') {
                    this.topCard.abilities.playActions.push(new AcademyPlayCharacterAction());
                }
            }
        });
    }
    
    onCardMoved(event) {
        if(event.card === this.topCard && event.originalLocation === 'conflict deck') {
            this.removeEffects();
            this.game.effectEngine.unapplyAndRemove(effect => effect.source.uuid === this.uuid);
        }
    }
    
    onPhaseEnded(event) {
        if(event.phase === 'conflict') {
            this.removeEffects();
        }
    }
    
    onDeckShuffled(event) {
        if(event.player === this.controller && event.deck === 'conflict deck') {
            this.removeEffects();
            this.game.effectEngine.unapplyAndRemove(effect => effect.source.uuid === this.uuid);
        }
    }
    
    removeEffects() {
        this.eventRegistrar.unregisterAll();
        this.topCard.abilities.playActions = _.reject(this.topCard.abilities.playActions, action => action.location === ['conflict deck']);
        _.each(this.topCard.actions, action => {
            let index = _.indexOf(action.location, 'conflict deck');
            if(index > -1) {
                action.location.splice(index, 1);
            }
            if(action.isEventListeningLocation(this.topCard.location)) {
                action.registerEvents();
            }
        });
        _.each(this.topCard.reactions, reaction => {
            let index = _.indexOf(reaction.location, 'conflict deck');
            if(index > -1) {
                reaction.location.splice(index, 1);
            }
            if(reaction.isEventListeningLocation(this.topCard.location)) {
                reaction.registerEvents();
                this.game.registerAbility(reaction);
            }
        });
        this.topCard = null;
    }
}

ArtisanAcademy.id = 'artisan-academy';

module.exports = ArtisanAcademy;
