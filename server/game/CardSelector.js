import ExactlyXCardSelector from './CardSelectors/ExactlyXCardSelector.js';
import MaxStatCardSelector from './CardSelectors/MaxStatCardSelector.js';
import MinStatCardSelector from './CardSelectors/MinStatCardSelector.js';
import MostStatCardSelector from './CardSelectors/MostStatCardSelector.js';
import LeastStatCardSelector from './CardSelectors/LeastStatCardSelector.js';
import SingleCardSelector from './CardSelectors/SingleCardSelector.js';
import UnlimitedCardSelector from './CardSelectors/UnlimitedCardSelector.js';
import UpToXCardSelector from './CardSelectors/UpToXCardSelector.js';
import MostHouseCardSelector from './CardSelectors/MostHouseCardSelector.js';
import XorMoreCardSelector from './CardSelectors/XorMoreCardSelector.js';

const defaultProperties = {
    numCards: 1,
    cardCondition: () => true,
    cardType: ['action', 'artifact', 'creature', 'upgrade'],
    multiSelect: false
};

const ModeToSelector = {
    ability: (p) => new SingleCardSelector(p),
    exactly: (p) => new ExactlyXCardSelector(p.numCards, p),
    leastStat: (p) => new LeastStatCardSelector(p),
    minStat: (p) => new MinStatCardSelector(p),
    maxStat: (p) => new MaxStatCardSelector(p),
    mostHouse: (p) => new MostHouseCardSelector(p),
    mostStat: (p) => new MostStatCardSelector(p),
    orMore: (p) => new XorMoreCardSelector(p.numCards, p),
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

export default CardSelector;
