describe('Uncharted Lands', function () {
    describe("Uncharted Lands's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['lieutenant-khrkhar', 'explo-rover', 'mother'],
                    hand: ['uncharted-lands']
                },
                player2: {
                    inPlay: ['urchin', 'crash-muldoon'],
                    amber: 3
                }
            });
        });

        it('should put 6A on itself when played.', function () {
            this.player1.play(this.unchartedLands);
            expect(this.unchartedLands.amber).toBe(6);
        });

        it('should transfer one from itself to the players pool when an SA creature reaps.', function () {
            this.player1.play(this.unchartedLands);
            expect(this.unchartedLands.amber).toBe(6);
            this.player1.reap(this.lieutenantKhrkhar);
            expect(this.player1.amber).toBe(2);
            expect(this.unchartedLands.amber).toBe(5);
        });

        it('should transfer a maximum of 6 when an SA creature reaps.', function () {
            this.player1.play(this.unchartedLands);
            expect(this.unchartedLands.amber).toBe(6);
            for (let i = 0; i < 6; ++i) {
                this.player1.reap(this.lieutenantKhrkhar);
                expect(this.player1.amber).toBe((i + 1) * 2);
                this.lieutenantKhrkhar.exhausted = false;
                expect(this.unchartedLands.amber).toBe(5 - i);
            }

            this.player1.reap(this.exploRover);
            expect(this.player1.amber).toBe(13);
            expect(this.unchartedLands.amber).toBe(0);
        });

        it('should not transfer one from itself to the players pool when a non-SA creature reaps.', function () {
            this.player1.play(this.unchartedLands);
            expect(this.unchartedLands.amber).toBe(6);
            this.player1.reap(this.lieutenantKhrkhar);
            expect(this.player1.amber).toBe(2);
            expect(this.unchartedLands.amber).toBe(5);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.reap(this.urchin);
            expect(this.unchartedLands.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
        });

        it('should transfer one from itself to the opponents pool when an opposing SA creature reaps.', function () {
            this.player1.play(this.unchartedLands);
            expect(this.unchartedLands.amber).toBe(6);
            this.player1.reap(this.lieutenantKhrkhar);
            expect(this.player1.amber).toBe(2);
            expect(this.unchartedLands.amber).toBe(5);
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.reap(this.crashMuldoon);
            expect(this.player2.amber).toBe(5);
            expect(this.player1.amber).toBe(2);
            expect(this.unchartedLands.amber).toBe(4);
        });
    });
});
