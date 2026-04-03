const DeckService = require('../../server/services/DeckService');

describe('DeckService alliance restricted list', function () {
    let service;

    beforeEach(function () {
        service = new DeckService({}, {});
    });

    it('allows alliance decks to include Reiteration', function () {
        expect(() =>
            service.validateAllianceRestrictedList(
                [
                    { id: 'reiteration', count: 2 },
                    { id: 'flaxia', count: 1 }
                ],
                886
            )
        ).not.toThrow();
    });

    it('allows alliance decks to include Strategic Feint', function () {
        expect(() =>
            service.validateAllianceRestrictedList(
                [
                    { id: 'strategic-feint', count: 2 },
                    { id: 'dextre', count: 1 }
                ],
                886
            )
        ).not.toThrow();
    });

    it('rejects alliance decks that include multiple restricted card names', function () {
        expect(() =>
            service.validateAllianceRestrictedList(
                [
                    { id: 'reiteration', count: 1 },
                    { id: 'strategic-feint', count: 1 }
                ],
                886
            )
        ).toThrow('Alliance deck may include cards from only one restricted card name');
    });

    it('keeps Key Abduction at one copy per deck', function () {
        expect(() =>
            service.validateAllianceRestrictedList(
                [
                    { id: 'key-abduction', count: 2 },
                    { id: 'dust-pixie', count: 1 }
                ],
                341
            )
        ).toThrow('Alliance restricted card key-abduction exceeds quantity limit of 1');
    });

    it('no longer treats Hallafest as an alliance restricted card', function () {
        expect(() =>
            service.validateAllianceRestrictedList(
                [
                    { id: 'hallafest', count: 1 },
                    { id: 'befuddle', count: 1 }
                ],
                600
            )
        ).not.toThrow();
    });
});
