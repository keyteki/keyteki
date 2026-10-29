const { matchDeckCards } = require('../../../server/scripts/deckcardmatcher');

describe('matchDeckCards', function () {
    const row = (id, cardId, properties = {}) =>
        Object.assign({ Id: id, CardId: cardId, Count: 1 }, properties);
    const card = (id, house, properties = {}) => Object.assign({ id, house, count: 1 }, properties);

    it('pairs stored cards with Master Vault cards by id and flags', function () {
        const updates = matchDeckCards(
            [row(1, 'troll'), row(2, 'cosmicrux', { Anomaly: 'staralliance' })],
            [
                card('cosmicrux', 'staralliance', { anomaly: 'staralliance' }),
                card('troll', 'brobnar')
            ]
        );

        expect(updates).toEqual([
            { id: 1, house: 'brobnar', maverick: undefined, anomaly: undefined },
            { id: 2, house: 'staralliance', maverick: undefined, anomaly: 'staralliance' }
        ]);
    });

    it('pairs a stored card missing its anomaly with the anomaly from Master Vault', function () {
        // e.g. an anomaly printed without the anomaly border, flagged by Master Vault later
        const updates = matchDeckCards(
            [row(1, 'cosmicrux')],
            [card('cosmicrux', 'staralliance', { anomaly: 'staralliance' })]
        );

        expect(updates).toEqual([
            { id: 1, house: 'staralliance', maverick: undefined, anomaly: 'staralliance' }
        ]);
    });

    it('pairs a stored card missing its maverick with the maverick from Master Vault', function () {
        const updates = matchDeckCards(
            [row(1, 'troll')],
            [card('troll', 'dis', { maverick: 'dis' })]
        );

        expect(updates).toEqual([{ id: 1, house: 'dis', maverick: 'dis', anomaly: undefined }]);
    });

    it('pairs exact matches before cards missing their flags', function () {
        const updates = matchDeckCards(
            [row(1, 'troll'), row(2, 'troll', { Maverick: 'dis' })],
            [card('troll', 'dis', { maverick: 'dis' }), card('troll', 'brobnar')]
        );

        expect(updates).toEqual([
            { id: 1, house: 'brobnar', maverick: undefined, anomaly: undefined },
            { id: 2, house: 'dis', maverick: 'dis', anomaly: undefined }
        ]);
    });

    it('does not pair cards whose stored flags differ', function () {
        const updates = matchDeckCards(
            [row(1, 'troll', { Maverick: 'logos' })],
            [card('troll', 'dis', { maverick: 'dis' })]
        );

        expect(updates).toEqual([]);
    });

    it('pairs enhanced copies by their enhancements', function () {
        const updates = matchDeckCards(
            [
                row(1, 'troll', { Enhancements: '["amber"]' }),
                row(2, 'troll', { Enhancements: '{draw}' })
            ],
            [
                card('troll', 'brobnar', { enhancements: ['draw'] }),
                card('troll', 'brobnar', { enhancements: ['amber'] })
            ]
        );

        expect(updates.map((update) => update.id)).toEqual([1, 2]);
    });
});
