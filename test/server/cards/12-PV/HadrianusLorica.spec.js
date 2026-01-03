describe('Hadrianus Lorica', function () {
    describe("Hadrianus Lorica's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'saurian',
                    hand: ['hadrianus-lorica'],
                    inPlay: ['raiding-knight', 'almsmaster']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump']
                }
            });
        });

        it('should give +3 armor to creatures with amber', function () {
            this.raidingKnight.tokens.amber = 2;
            this.player1.play(this.hadrianusLorica);
            this.player1.clickPrompt('Done');
            expect(this.raidingKnight.armor).toBe(5);
            expect(this.almsmaster.armor).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should allow optional exalt when played', function () {
            this.player1.play(this.hadrianusLorica);
            this.player1.clickCard(this.hadrianusLorica);
            expect(this.hadrianusLorica.tokens.amber).toBe(1);
            expect(this.hadrianusLorica.armor).toBe(3);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not require exalt when played', function () {
            this.player1.play(this.hadrianusLorica);
            this.player1.clickPrompt('Done');
            expect(this.hadrianusLorica.tokens.amber).toBeUndefined();
            expect(this.hadrianusLorica.armor).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
