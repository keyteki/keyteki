const ExactlyXCardSelector = require('./CardSelectors/ExactlyXCardSelector');
const MaxStatCardSelector = require('./CardSelectors/MaxStatCardSelector');
const SingleCardSelector = require('./CardSelectors/SingleCardSelector');
const UnlimitedCardSelector = require('./CardSelectors/UnlimitedCardSelector');
const UpToXCardSelector = require('./CardSelectors/UpToXCardSelector');

const defaultProperties = {
    numCards: 1,
    cardCondition: () => true,
    cardType: ['attachment', 'character', 'event', 'holding', 'stronghold', 'role', 'province'],
    gameAction: 'target',
    multiSelect: false
};

const ModeToSelector = {
    exactly: p => new ExactlyXCardSelector(p.numCards, p),
    maxStat: p => new MaxStatCardSelector(p),
    ring: p => new RingSelector(p),
    select: p => new SelectSelector(p),
    single: p => new SingleCardSelector(p),
    unlimited: p => new UnlimitedCardSelector(p),
    upTo: p => new UpToXCardSelector(p.numCards, p)
};

class CardSelector {
    static for(properties) {
        properties = CardSelector.getDefaultedProperties(properties);

        let factory = ModeToSelector[properties.mode];

        if(!factory) {
            throw new Error(`Unknown card selector mode of ${properties.mode}`);
        }

        return factory(properties);
    }

    static getDefaultedProperties(properties) {
        properties = Object.assign({}, defaultProperties, properties);
        if(properties.mode) {
            return properties;
        }

        if(properties.maxStat) {
            properties.mode = 'maxStat';
        } else if(properties.numCards === 1 && !properties.multiSelect) {
            properties.mode = 'single';
        } else if(properties.numCards === 0) {
            properties.mode = 'unlimited';
        } else {
            properties.mode = 'upTo';
        }

        return properties;
    }
}

module.exports = CardSelector;
