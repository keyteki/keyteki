describe('Reckless Rizzo', function () {
    describe("Reckless Rizzo's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['reckless-rizzo'],
                    amber: 1
                },
                player2: {
                    inPlay: ['lamindra'],
                    amber: 4
                }
            });
        });

        it('should steal 2A and lose elusive', function () {
            expect(this.recklessRizzo.getKeywordValue('elusive')).toBe(1);
            this.player1.useAction(this.recklessRizzo);
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(2);
            expect(this.recklessRizzo.getKeywordValue('elusive')).toBe(0);
        });

        it('should lose elusive even if no amber is stolen', function () {
            this.player2.amber = 0;
            expect(this.recklessRizzo.getKeywordValue('elusive')).toBe(1);
            this.player1.useAction(this.recklessRizzo);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.recklessRizzo.getKeywordValue('elusive')).toBe(0);
        });

        it('should last for a single round', function () {
            expect(this.recklessRizzo.getKeywordValue('elusive')).toBe(1);
            this.player1.useAction(this.recklessRizzo);
            expect(this.recklessRizzo.getKeywordValue('elusive')).toBe(0);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.recklessRizzo.getKeywordValue('elusive')).toBe(0);
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.recklessRizzo.getKeywordValue('elusive')).toBe(1);
        });
    });

    describe('after taking another turn', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 0,
                    house: 'shadows',
                    hand: [],
                    inPlay: ['tachyon-manifold', 'reckless-rizzo']
                },
                player2: {
                    amber: 0,
                    hand: [],
                    inPlay: ['teliga']
                }
            });
            this.tachyonManifold.maverick = 'shadows';
            this.tachyonManifold.printedHouse = 'shadows';
            this.player1.useAction(this.tachyonManifold);
        });

        it("should not affect player's next turn", function () {
            this.player1.useAction(this.recklessRizzo);
            expect(this.recklessRizzo.getKeywordValue('elusive')).toBe(0);
            this.player1.endTurn();
            this.player1.clickPrompt('shadows');
            expect(this.recklessRizzo.getKeywordValue('elusive')).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
