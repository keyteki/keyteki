const ExactlyXCardSelector = require('./CardSelectors/ExactlyXCardSelector');
const MaxStatCardSelector = require('./CardSelectors/MaxStatCardSelector');
const MinStatCardSelector = require('./CardSelectors/MinStatCardSelector');
const MostStatCardSelector = require('./CardSelectors/MostStatCardSelector');
const LeastStatCardSelector = require('./CardSelectors/LeastStatCardSelector');
const SingleCardSelector = require('./CardSelectors/SingleCardSelector');
const UnlimitedCardSelector = require('./CardSelectors/UnlimitedCardSelector');
const UpToXCardSelector = require('./CardSelectors/UpToXCardSelector');
const MostHouseCardSelector = require('./CardSelectors/MostHouseCardSelector');

const defaultProperties = {
    numCards: 1,
    cardCondition: () => true,
    cardType: ['action', 'artifact', 'creature', 'upgrade'],
    multiSelect: false
};

const ModeToSelector = {
    ability: (p) => new SingleCardSelector(p),
    exactly: (p) => new ExactlyXCardSelector(p.numCards, p),
    minStat: (p) => new MinStatCardSelector(p),
    maxStat: (p) => new MaxStatCardSelector(p),
    mostHouse: (p) => new MostHouseCardSelector(p),
    mostStat: (p) => new MostStatCardSelector(p),
    leastStat: (p) => new LeastStatCardSelector(p),
    single: (p) => new SingleCardSelector(p),
    unlimited: (p) => new UnlimitedCardSelector(p),
    upTo: (p) => new UpToXCardSelector(p.numCards, p)
};

class CardSelector {
    static for(properties) {
        properties = CardSelector.getDefaultedProperties(properties);

        let factory = ModeToSelector[properties.mode];

        if (!factory) {
            throw new Error(`Unknown card selector mode of ${properties.mode}`);
        }

        return factory(properties);
    }

    static getDefaultedProperties(properties) {
        properties = Object.assign({}, defaultProperties, properties);
        if (properties.mode) {
            return properties;
        }

        if (properties.maxStat) {
            properties.mode = 'maxStat';
        } else if (properties.minStat) {
            properties.mode = 'minStat';
        } else if (properties.numCards === 1 && !properties.multiSelect) {
            properties.mode = 'single';
        } else if (properties.numCards === 0) {
            properties.mode = 'unlimited';
        } else {
            properties.mode = 'upTo';
        }

        return properties;
    }
}

module.exports = CardSelector;
