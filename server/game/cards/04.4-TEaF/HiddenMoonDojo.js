const DrawCard = require('../../drawcard.js');
const PlayCharacterAction = require('../../playcharacteraction.js');

class HiddenMoonDojoPlayAction extends PlayCharacterAction {
    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if(ignoredRequirements.includes('location')) {
            return super.meetsRequirements(context, ignoredRequirements);
        }
        return super.meetsRequirements(context, ignoredRequirements.concat('location'));
    }
}

class HiddenMoonDojo extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetLocation: 'province',
            match: card => card.isDynasty && this.controller.areLocationsAdjacent(this.location, card.location),
            effect: ability.effects.gainPlayAction(HiddenMoonDojoPlayAction)
        });

        this.action({
            title: 'Turn an adjacent card face up',
            condition: () => this.game.isDuringConflict(),
            gameAction: ability.actions.flipDynasty({
                promptForSelect: {
                    location: 'province',
                    controller: 'self',
                    cardCondition: (card, context) => context.player.areLocationsAdjacent(context.source.location, card.location)
                }
            })
        });
    }
}

HiddenMoonDojo.id = 'hidden-moon-dojo';

module.exports = HiddenMoonDojo;
