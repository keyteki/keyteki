const _ = require('underscore');

const EventToTitleFunc = {
    onCardAbilityInitiated: (event) => 'the effects of ' + event.card.name,
    onCardDestroyed: (event) => event.card.name + ' being destroyed',
    onCardLeavesPlay: (event) =>
        event.card.name +
        (event.triggeringEvent && event.triggeringEvent.name === 'onCardDestroyed'
            ? ' being destroyed'
            : ' leaving play'),
    onCharacterEntersPlay: (event) => event.card.name + ' entering play',
    onCardPlayed: (event) => event.card.name + ' being played',
    onPhaseEnd: (event) => event.phase + ' phase ending',
    onPhaseStarted: (event) => event.phase + ' phase starting'
};

const AbilityTypeToWord = {
    cancelinterrupt: 'interrupt',
    interrupt: 'interrupt',
    reaction: 'reaction',
    forcedreaction: 'forced reaction',
    forcedinterrupt: 'forced interrupt',
    whenrevealed: 'when revealed'
};

function FormatTitles(titles) {
    return _.reduce(
        titles,
        (string, title, index) => {
            if (index === 0) {
                return title;
            } else if (index === titles.length - 1) {
                return title + ' or ' + string;
            }

            return title + ', ' + string;
        },
        ''
    );
}

const AbilityWindowTitles = {
    getTitle: function (abilityType, events) {
        if (!_.isArray(events)) {
            events = [events];
        }

        let abilityWord = AbilityTypeToWord[abilityType] || abilityType;
        let titles = _.filter(
            _.map(events, (event) => {
                let func = EventToTitleFunc[event.name];
                if (func) {
                    return func(event);
                }
            }),
            (string) => string
        );

        if (['forcedreaction', 'forcedinterrupt', 'whenrevealed'].includes(abilityType)) {
            if (titles.length > 0) {
                return 'Choose ' + abilityWord + ' order for ' + FormatTitles(titles);
            }

            return 'Choose ' + abilityWord + ' order';
        }

        if (titles.length > 0) {
            return 'Any ' + abilityWord + 's to ' + FormatTitles(titles) + '?';
        }

        return 'Any ' + abilityWord + 's?';
    },
    getAction: function (event) {
        let func = EventToTitleFunc[event.name];
        if (func) {
            return func(event);
        }

        return event.name;
    }
};

module.exports = AbilityWindowTitles;
