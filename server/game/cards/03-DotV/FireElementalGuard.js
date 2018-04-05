const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');

class FireElementalGuard extends DrawCard {
    setupCardAbilities() {
        this.spellsPlayedThisConflict = {};
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'onCardPlayed']);
        this.action({
            title: 'Discard an attachment',
            condition: context => this.spellsPlayedThisConflict[context.player.name] > 2,
            target: {
                cardType: 'attachment',
                gameAction: 'discardFromPlay'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to discard {2}', context.player, context.source, context.target);
                this.game.applyGameAction(context, { discardFromPlay: context.target });
            }
        });
    }

    onConflictFinished() {
        this.spellsPlayedThisConflict = {};
    }

    onCardPlayed(event) {
        if(this.game.currentConflict && event.card.hasTrait('spell')) {
            if(this.spellsPlayedThisConflict[event.player.name]) {
                this.spellsPlayedThisConflict[event.player.name] += 1;
            } else {
                this.spellsPlayedThisConflict[event.player.name] = 1;
            }
        }
    }
}

FireElementalGuard.id = 'fire-elemental-guard'; // This is a guess at what the id might be - please check it!!!

module.exports = FireElementalGuard;
