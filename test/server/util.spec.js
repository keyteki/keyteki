const { detectBinary } = require('../../server/util');

describe('detectBinary', function () {
    it('returns no findings for plain serializable state', function () {
        const state = {
            name: 'game',
            players: [
                { name: 'p1', wins: 0 },
                { name: 'p2', wins: 1 }
            ],
            createdAt: new Date()
        };

        expect(detectBinary(state)).toEqual([]);
    });

    it('flags non-serializable values with their path and type', function () {
        const state = { foo: { bar: Buffer.from('hi') } };

        const results = detectBinary(state);

        expect(results).toEqual([{ path: '.foo.bar', type: 'Buffer' }]);
    });

    it('does not stack overflow on a self-referential object', function () {
        const state = { name: 'cycle' };
        state.self = state;

        let results;
        expect(() => {
            results = detectBinary(state);
        }).not.toThrow();

        expect(results).toContainEqual({ path: '.self', type: 'Circular' });
    });

    it('does not stack overflow on a card-like back-reference cycle', function () {
        // Mirrors the shape of a Card serialization where an upgrade points
        // back at its parent creature, which is what we suspect causes the
        // socket.io `hasBinary` infinite recursion in production.
        const creature = { uuid: 'c1', name: 'creature', upgrades: [] };
        const upgrade = { uuid: 'u1', name: 'upgrade', parent: creature };
        creature.upgrades.push(upgrade);

        const state = { players: { p1: { cardsInPlay: [creature] } } };

        let results;
        expect(() => {
            results = detectBinary(state);
        }).not.toThrow();

        expect(results).toContainEqual({
            path: '.players.p1.cardsInPlay[0].upgrades[0].parent',
            type: 'Circular'
        });
    });

    it('does not stack overflow on cyclic arrays', function () {
        const arr = [];
        arr.push(arr);

        let results;
        expect(() => {
            results = detectBinary({ a: arr });
        }).not.toThrow();

        expect(results).toContainEqual({ path: '.a[0]', type: 'Circular' });
    });

    it('does not flag shared (non-cyclic) sub-objects as circular', function () {
        // Game state legitimately reaches the same player object via multiple
        // paths (e.g. activePlayer and players.p1) without forming a true
        // cycle. detectBinary must only report true ancestor cycles.
        const player = { name: 'p1' };
        const state = {
            activePlayer: player,
            players: { p1: player },
            history: [player, player]
        };

        expect(detectBinary(state)).toEqual([]);
    });
});
