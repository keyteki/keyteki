const AbilityContext = require('../../AbilityContext.js');
const DrawCard = require('../../drawcard.js');
const PlayAttachmentAction = require('../../playattachmentaction.js');

class GuidanceOfTheAncestors extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Play this from the discard pile',
            condition: context => context.player.fate >= context.player.getReducedCost('play', context.source),
            location: 'conflict discard pile',
            effect: 'play {0} from the discard pile',
            handler: context => this.game.resolveAbility(new AbilityContext({
                game: this.game,
                player: context.player,
                source: context.source,
                ability: new PlayAttachmentAction(context.source)
            }))
        });
    }
}

GuidanceOfTheAncestors.id = 'guidance-of-the-ancestors';

module.exports = GuidanceOfTheAncestors;
