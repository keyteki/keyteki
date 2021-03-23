describe('AlmsmasterEvilTwin', function () {
    describe("AlmsmasterEvilTwin' gain ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['gub', 'almsmaster-evil-twin', 'streke', 'krump'],
                    hand: ['collar-of-subordination', 'hand-of-dis', 'gateway-to-dis', 'shooler'],
                    amber: 0
                },
                player2: {
                    inPlay: ['lamindra'],
                    hand: ['relentless-whispers'],
                    amber: 4
                }
            });
        });

        it('should steal on neighbor destroy', function () {
            this.player1.play(this.handOfDis);
            this.player1.clickCard(this.streke);

            expect(this.streke.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(3);
        });

        it('should move should steal 2 on a board wipe', function () {
            this.player1.play(this.gatewayToDis);
            this.player1.clickCard(this.gub);
            expect(this.streke.location).toBe('discard');
            expect(this.gub.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.almsmasterEvilTwin.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(2);
        });
    });
});
