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

    it('allows a single unchanged alliance deck even if it contains multiple restricted card names', async function () {
        const sourceDeck = {
            uuid: 'deck-1',
            expansion: 886,
            houses: ['logos', 'staralliance', 'untamed'],
            cards: [
                { id: 'reiteration', count: 1, house: 'logos' },
                { id: 'dextre', count: 1, house: 'logos' },
                { id: 'strategic-feint', count: 1, house: 'staralliance' },
                { id: 'medic-ingram', count: 1, house: 'staralliance' },
                { id: 'flaxia', count: 1, house: 'untamed' },
                { id: 'dust-pixie', count: 1, house: 'untamed' }
            ]
        };

        service.cardService = {
            getAllCards: vi.fn().mockResolvedValue({}),
            getCardsForExpansionById: vi.fn().mockResolvedValue({})
        };
        service.getByUuidForUser = vi.fn().mockResolvedValue(sourceDeck);
        service.insertDeck = vi.fn().mockImplementation(async (deck) => deck);
        service.validateAllianceRestrictedList = vi.fn(() => {
            throw new Error('restricted list should not be checked for an unchanged single deck');
        });

        const allianceDeck = await service.createAlliance(
            { id: 1 },
            {
                name: 'Single Deck Alliance',
                pods: ['deck-1:logos', 'deck-1:staralliance', 'deck-1:untamed']
            }
        );

        expect(service.validateAllianceRestrictedList).not.toHaveBeenCalled();
        expect(service.insertDeck).toHaveBeenCalledOnce();
        expect(allianceDeck.isAlliance).toBe(true);
        expect(allianceDeck.cards.map((card) => card.id)).toContain('reiteration');
        expect(allianceDeck.cards.map((card) => card.id)).toContain('strategic-feint');
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
