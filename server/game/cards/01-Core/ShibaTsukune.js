const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class ShibaTsukune extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Resolve 2 rings',
            when : {
                onPhaseEnded: event => event.phase === 'conflict'
            },
            handler: context => this.game.promptForRingSelect(context.player, {
                activePromptTitle: 'Choose a ring to resolve',
                source: context.source,
                ringCondition: ring => !ring.claimed,
                onSelect: (player, firstRing) => {
                    if(_.size(_.filter(this.game.rings, ring => !ring.claimed)) > 1) {
                        this.game.promptForRingSelect(player, {
                            activePromptTitle: 'Choose a second ring to resolve, or click Done',
                            ringCondition: ring => !ring.claimed && ring !== firstRing,
                            source: context.source,
                            optional: true,
                            onMenuCommand: player => {
                                this.game.addMessage('{0} uses {1} to resolve the {2} ring', context.player, context.source, firstRing.element);
                                player.resolveRingEffects(firstRing.element);
                                return true;
                            },
                            onSelect: (player, secondRing) => {
                                let array = [firstRing.element, secondRing.element];
                                this.game.addMessage('{0} uses {1} to resolve the {2} rings', context.player, context.source, array);
                                player.resolveRingEffects(array);
                                return true;
                            }
                        });
                    } else {
                        this.game.addMessage('{0} uses {1} to resolve the {2} ring', context.player, context.source, firstRing.element);
                        player.resolveRingEffects(firstRing.element);
                    }
                    return true;
                }
            })
        });
    }
}

ShibaTsukune.id = 'shiba-tsukune';

module.exports = ShibaTsukune;
