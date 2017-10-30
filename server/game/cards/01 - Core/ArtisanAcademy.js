const _ = require('underscore');

const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');
const PlayCharacterAction = require('../../playcharacteraction.js');

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
        this.eventsRegistrar = new EventsRegistrar
        this.action({
            title: 'Draw a card',
            phase: 'conflict',
            handler: () => {
                let topCard = this.controller.conflictDeck.first();
                this.game.addMessage('{0} uses {1} to reveal the top card of their conflict deck: {2}', this.controller, this, topCard);
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    effect: ability.effects.revealTopCardOfConflictDeck()
                }));
                _.each(topCard.abilities.playActions, action => {
                    if(action.location && action.location.includes('hand')) {
                        let clonedAction = _.clone(action);
                        clonedAction.location = ['conflict deck'];
                        console.log('playAction', action.title)
                        this.untilEndOfPhase(ability => ({
                            match: topCard,
                            targetLocation: 'conflict deck',
                            effect: ability.effects.gainPlayAction(clonedAction)
                        }));
                    }
                });
                if(topCard.type === 'event') {
                    console.log('event')
                    this.untilEndOfPhase(ability => ({
                        match: topCard,
                        targetLocation: 'conflict deck',
                        effect: ability.effects.enableEventToBeUsedInCurrentLocaton()
                    }));
                } else if(topCard.type === 'attachment') {
                    console.log('attachment')
                    this.untilEndOfPhase(ability => ({
                        match: topCard,
                        targetLocation: 'conflict deck',
                        effect: ability.effects.gainPlayAction(new AcademyPlayAttachmentAction())
                    }));
                    
                } else if(topCard.type === 'character') {
                    console.log('character')
                    this.untilEndOfPhase(ability => ({
                        match: topCard,
                        targetLocation: 'conflict deck',
                        effect: ability.effects.gainPlayAction(new AcademyPlayCharacterAction())
                    }));
                }
            }
        });
    }
}

ArtisanAcademy.id = 'artisan-academy';

module.exports = ArtisanAcademy;
