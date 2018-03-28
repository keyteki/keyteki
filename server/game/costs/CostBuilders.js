const CostBuilder = require('./CostBuilder.js');
const DiscardFromHandCost = require('./DiscardFromHandCost.js');
const GameActionCost = require('./GameActionCost');

const CostBuilders = {
    bow: new CostBuilder(new GameActionCost('bow'), {
        select: 'Select card to bow',
        selectMultiple: number => `Select ${number} cards to bow`
    }),
    break: new CostBuilder(new GameActionCost('break'), {
        select: 'Select province to break',
        selectMultiple: number => `Select ${number} provinces to break`
    }),
    discardFromHand: new CostBuilder(new DiscardFromHandCost(), {
        select: 'Select card to discard from hand',
        selectMultiple: number => `Select ${number} cards to discard from hand`
    }),
    discardFate: new CostBuilder(new GameActionCost('discardFate', 'removeFate'), {
        select: 'Select character to discard a fate from',
        selectMultiple: number => `Select ${number} cards to discard a fate from`
    }),
    dishonor: new CostBuilder(new GameActionCost('dishonor'), {
        select: 'Select character to dishonor',
        selectMultiple: number => `Select ${number} characters to dishonor`
    }),
    returnToHand: new CostBuilder(new GameActionCost('returnToHand'), {
        select: 'Select card to return to hand',
        selectMultiple: number => `Select ${number} cards to return to hand`
    }),
    sacrifice: new CostBuilder(new GameActionCost('sacrifice'), {
        select: 'Select card to sacrifice',
        selectMultiple: number => `Select ${number} cards to sacrifice`
    })
};

module.exports = CostBuilders;
