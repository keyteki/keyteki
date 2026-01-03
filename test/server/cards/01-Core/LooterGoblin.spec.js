describe('Looter Goblin', function () {
    describe("Looter Goblin's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['punch', 'lava-ball'],
                    inPlay: ['looter-goblin', 'wardrummer']
                },
                player2: {
                    inPlay: ['lamindra', 'silvertooth']
                }
            });
        });

        it('should gain 1 amber for each enemy creature destroyed', function () {
            this.player1.reap(this.looterGoblin);
            expect(this.player1.amber).toBe(1);
            this.player1.play(this.lavaBall);
            this.player1.clickCard(this.lamindra);
            this.player1.clickPrompt('Autoresolve');
            expect(this.lamindra.location).toBe('discard');
            expect(this.silvertooth.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not gain amber for friendly creature destroyed', function () {
            this.player1.reap(this.looterGoblin);
            expect(this.player1.amber).toBe(1);
            this.player1.play(this.punch);
            this.player1.clickCard(this.wardrummer);
            expect(this.wardrummer.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should still gain amber if looter goblin leaves play', function () {
            this.player1.reap(this.looterGoblin);
            expect(this.player1.amber).toBe(1);
            this.player1.play(this.punch);
            this.player1.clickCard(this.looterGoblin);
            expect(this.looterGoblin.location).toBe('discard');
            this.player1.play(this.lavaBall);
            this.player1.clickCard(this.lamindra);
            this.player1.clickPrompt('Autoresolve');
            expect(this.lamindra.location).toBe('discard');
            expect(this.silvertooth.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
