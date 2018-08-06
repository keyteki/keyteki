const DrawCard = require('../../drawcard.js');

class ImperialLibrarian extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card !== this,
            targetController: 'any',
            effect: ability.effects.modifyGlory(1)
        });
    }
}

ImperialLibrarian.id = 'imperial-librarian';
module.exports = ImperialLibrarian;
