const RingAction = require('./RingAction');
const ResolveElementAction = require('./ResolveElementAction');

class ResolveConflictRingAction extends RingAction {
    setDefaultProperties() {
        this.resolveAsAttacker = true;
    }

    setup() {
        super.setup();
        this.name = 'resolveRing';
        this.effectMsg = 'resolve {0}' + (this.resolveAsAttacker ? '' : ' for the attacking player');
    }

    getEvent(ring, context) {
        let conflict = context.game.currentConflict;
        if(!conflict && !this.resolveAsAttacker) {
            return;
        }
        let player = this.resolveAsAttacker ? context.player : context.game.currentConflict.attackingPlayer;
        let elements = ring.getElements();
        return super.createEvent('onResolveConflictRing', { player: player, conflict: conflict, ring: ring, context: context }, () => {
            if(elements.length === 1 || (!this.resolveAsAttacker && conflict.elementsToResolve >= elements.length)) {
                this.resolveRingEffects(player, elements, this.resolveAsAttacker);
            } else {
                this.chooseElementsToResolve(player, elements, this.resolveAsAttacker, conflict.elementsToResolve);
            }
        });
    }

    chooseElementsToResolve(player, elements, optional, elementsToResolve, chosenElements = []) {
        if(elements.length === 0 || elementsToResolve === 0) {
            this.resolveRingEffects(player, chosenElements, optional);
            return;
        }
        let activePromptTitle = 'Choose a ring effect to resolve';
        if(chosenElements.length > 0) {
            activePromptTitle = chosenElements.reduce((string, element) => string + ' ' + element, activePromptTitle + '\nChosen elements:');
        }
        let buttons = [];
        if(optional) {
            if(chosenElements.length > 0 && optional) {
                buttons.push({ text: 'Done', arg: 'done' });
            }
            if(elementsToResolve >= elements.length) {
                buttons.push({ text: 'Resolve All Elements', arg: 'all' });
            }
            buttons.push({ text: 'Don\'t Resolve the Conflict Ring', arg: 'cancel' });
        }
        player.game.promptForRingSelect(player, {
            activePromptTitle: activePromptTitle,
            buttons: buttons,
            source: 'Resolve Ring Effect',
            ringCondition: ring => elements.includes(ring.element),
            onSelect: (player, ring) => {
                elementsToResolve--;
                chosenElements.push(ring.element);
                this.chooseElementsToResolve(player, elements.filter(e => e !== ring.element), optional, elementsToResolve, chosenElements);
                return true;
            },
            onCancel: player => player.game.addMessage('{0} chooses not to resolve the conflict ring', player),
            onMenuCommand: (player, arg) => {
                if(arg === 'all') {
                    this.resolveRingEffects(player, elements.concat(chosenElements));
                } else if(arg === 'done') {
                    this.resolveRingEffects(player, chosenElements, optional);
                }
                return true;
            }
        });
    }

    resolveRingEffects(player, elements, optional = true) {
        if(!Array.isArray(elements)) {
            elements = [elements];
        }
        let rings = elements.map(element => player.game.rings[element]);
        let action = new ResolveElementAction({ target: rings, optional: optional });
        player.game.openThenEventWindow(action.getEventArray(player.game.getFrameworkContext(player)));
    }
}

module.exports = ResolveConflictRingAction;
