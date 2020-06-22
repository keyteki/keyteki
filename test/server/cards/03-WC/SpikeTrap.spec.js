describe('Spike Trap', function () {
    describe("Spike Trap's omni ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    amber: 1,
                    inPlay: ['spike-trap'],
                    hand: ['lifeward']
                },
                player2: {
                    amber: 4,
                    hand: ['brammo', 'gub', 'firespitter']
                }
            });
        });
        it('should sacrifice the artifact', function () {
            this.player1.useAction(this.spikeTrap, true);
            expect(this.spikeTrap.location).toBe('discard');
        });
    });
});
describe("Spike Trap's omni ability", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                house: 'dis',
                amber: 1,
                inPlay: ['flaxia', 'spike-trap'],
                hand: ['lifeward']
            },
            player2: {
                amber: 4,
                inPlay: ['brammo', 'gub', 'firespitter']
            }
        });
    });
    it('should sacrifice the artifact and deal 3 damages to flank creatures', function () {
        this.player1.useAction(this.spikeTrap, true);
        expect(this.spikeTrap.location).toBe('discard');

        expect(this.flaxia.tokens.damage).toBe(3);
        expect(this.brammo.tokens.damage).toBe(2);
        expect(this.firespitter.tokens.damage).toBe(2);
        expect(this.gub.hasToken('damage')).toBe(false);
    });
});
