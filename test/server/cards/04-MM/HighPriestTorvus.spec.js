describe('High Priest Torvus', function () {
    describe("HighPriestTorvus's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['high-priest-torvus', 'senator-shrix'],
                    hand: ['siren-horn', 'galeatops', 'imperium', 'triumph', 'city-gates']
                },
                player2: {
                    inPlay: ['troll', 'flaxia'],
                    amber: 2
                }
            });
        });

        it('should not return an action card to hand before reaping', function () {
            this.player1.play(this.triumph);
            expect(this.triumph.location).toBe('discard');
        });

        it('should not return an action card to hand if not opt to exalt Priest', function () {
            this.player1.reap(this.highPriestTorvus);
            this.player1.clickPrompt('Done');
            this.player1.play(this.triumph);
            expect(this.triumph.location).toBe('discard');
        });

        it('should not return an action card to hand if opt to exalt Priest', function () {
            this.player1.reap(this.highPriestTorvus);
            this.player1.clickCard(this.highPriestTorvus);
            expect(this.highPriestTorvus.amber).toBe(1);
            this.player1.play(this.triumph);
            expect(this.triumph.location).toBe('hand');
            this.player1.play(this.imperium);
            this.player1.clickCard(this.senatorShrix);
            this.player1.clickCard(this.highPriestTorvus);
            this.player1.clickPrompt('Done');
            expect(this.imperium.location).toBe('discard');
            this.player1.play(this.triumph);
            expect(this.triumph.location).toBe('discard');
        });

        it('should not return a creature to hand', function () {
            this.player1.reap(this.highPriestTorvus);
            this.player1.clickCard(this.highPriestTorvus);
            expect(this.highPriestTorvus.amber).toBe(1);
            this.player1.play(this.galeatops);
            expect(this.galeatops.location).toBe('play area');
        });

        it('should not return an artifact to hand', function () {
            this.player1.reap(this.highPriestTorvus);
            this.player1.clickCard(this.highPriestTorvus);
            expect(this.highPriestTorvus.amber).toBe(1);
            this.player1.play(this.cityGates);
            expect(this.cityGates.location).toBe('play area');
        });
    });
});
