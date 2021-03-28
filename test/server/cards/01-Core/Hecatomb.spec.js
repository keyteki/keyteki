describe('Hecatomb', function () {
    describe("Hecatomb's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['hecatomb'],
                    amber: 0,
                    inPlay: ['rotgrub', 'ember-imp']
                },
                player2: {
                    amber: 0,
                    inPlay: ['bloodshard-imp']
                }
            });
        });
        it('should award 1 amber for each dis creature destroyed to respective controllers', function () {
            this.player1.play(this.hecatomb);
            expect(this.player1.player.amber).toBe(3);
            expect(this.player2.player.amber).toBe(1);
            expect(this.emberImp.location).toBe('discard');
            expect(this.rotgrub.location).toBe('discard');
            expect(this.bloodshardImp.location).toBe('discard');
        });
    });
    describe("Hecatomb's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['hecatomb'],
                    amber: 0,
                    inPlay: ['rotgrub', 'ember-imp', 'harbinger-of-doom']
                },
                player2: {
                    amber: 0,
                    inPlay: ['bloodshard-imp', 'krump', 'bumpsy']
                }
            });
        });
        it('should not award amber for non dis creatures as an aftereffect', function () {
            this.player1.play(this.hecatomb);
            expect(this.player1.player.amber).toBe(4);
            expect(this.player2.player.amber).toBe(1);
            expect(this.emberImp.location).toBe('discard');
            expect(this.rotgrub.location).toBe('discard');
            expect(this.bloodshardImp.location).toBe('discard');
            expect(this.harbingerOfDoom.location).toBe('discard');
            expect(this.bumpsy.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
        });
    });
});
