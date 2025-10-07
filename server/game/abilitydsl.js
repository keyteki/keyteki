import Effects from './effects.js';
import GameActions from './GameActions.js';
import AbilityLimit from './abilitylimit.js';
import Costs from './costs.js';

const AbilityDsl = {
    actions: GameActions,
    costs: Costs,
    effects: Effects,
    limit: AbilityLimit
};

export default AbilityDsl;
