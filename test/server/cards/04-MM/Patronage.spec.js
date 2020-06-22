describe('Patronage', function () {
    describe("Patronage's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['senator-shrix'],
                    hand: ['patronage']
                },
                player2: {
                    amber: 3,
                    inPlay: ['redlock']
                }
            });
        });

        it('should be able to select a creature without amber', function () {
            this.redlock.tokens.amber = 2;
            this.player1.play(this.patronage);
            expect(this.player1).toBeAbleToSelect(this.senatorShrix);
            expect(this.player1).toBeAbleToSelect(this.redlock);
            this.player1.clickCard(this.senatorShrix);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(3);
        });

        describe('Select a creature with 1A on it', function () {
            beforeEach(function () {
                this.senatorShrix.tokens.amber = 1;
                this.player1.play(this.patronage);
                this.player1.clickCard(this.senatorShrix);
            });

            it('should remove amber from it', function () {
                expect(this.senatorShrix.amber).toBe(0);
            });

            it('and move half+1 amber to active player', function () {
                expect(this.player1.amber).toBe(1);
            });

            it('and move remaining amber to opponent', function () {
                expect(this.player2.amber).toBe(3);
            });
        });

        describe('Select a creature with more than 1A on it', function () {
            beforeEach(function () {
                this.redlock.tokens.amber = 7;
                this.player1.play(this.patronage);
                this.player1.clickCard(this.redlock);
            });

            it('should remove amber from it', function () {
                expect(this.redlock.amber).toBe(0);
            });

            it('and move half+1 amber to active player', function () {
                expect(this.player1.amber).toBe(4);
            });

            it('and move remaining amber to opponent', function () {
                expect(this.player2.amber).toBe(6);
            });
        });
    });
});
