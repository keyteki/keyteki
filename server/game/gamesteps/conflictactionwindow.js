const ActionWindow = require('./actionwindow.js');

const capitalize = {
    military: 'Military',
    political: 'Political',
    air: 'Air',
    water: 'Water',
    earth: 'Earth',
    fire: 'Fire',
    void: 'Void'
};

class ConflictActionWindow extends ActionWindow {
    constructor(game, title, conflict) {
        super(game, title, 'conflict');
        this.conflict = conflict;    
    }
    
    activePrompt() {
        let buttons = [
            { text: 'Pass', arg: 'pass' }
        ];
        if(this.game.manualMode) {
            buttons.unshift({ text: 'Manual Action', arg: 'manual'});
        }
        
        this.conflict.calculateSkill();
        let conflictText = capitalize[this.conflict.conflictType] + ' ' + capitalize[this.conflict.conflictRing] + ' conflict';
        let skillText = 'Attacker: ' + this.conflict.attackerSkill + ' Defender: ' + this.conflict.defenderSkill;
        return {
            menuTitle: [conflictText, skillText].join('\n'),
            buttons: buttons,
            promptTitle: this.title
        };
    }

}

module.exports = ConflictActionWindow;
