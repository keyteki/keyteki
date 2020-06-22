describe('munchling', function () {
    describe("Munchling's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    archives: ['snufflegator'],
                    hand: ['eyegor'],
                    inPlay: ['munchling'],
                    amber: 0
                },
                player2: {
                    inPlay: ['helper-bot']
                }
            });
            this.player1.fightWith(this.munchling, this.helperBot);
        });

        it('give prompt', function () {
            expect(this.player1).toBeAbleToSelect(this.munchling);
        });

        describe('and the ability is triggered', function () {
            beforeEach(function () {
                this.player1.clickCard(this.munchling);
            });

            it('and gives prompt', function () {
                expect(this.player1).toHavePrompt('Choose a card');
                expect(this.player1).toBeAbleToSelect(this.eyegor);
                expect(this.player1).toBeAbleToSelect(this.snufflegator);
            });

            describe('discard from hand', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.eyegor);
                });

                it('and gain amber', function () {
                    expect(this.eyegor.location).toBe('discard');
                    expect(this.player1.amber).toBe(1);
                });
            });

            describe('discard from archive', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.snufflegator);
                });
                it('gives amber', function () {
                    expect(this.snufflegator.location).toBe('discard');
                    expect(this.player1.amber).toBe(1);
                });
            });
        });

        describe('and the ability is not triggered', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Done');
            });

            it('should end effect', function () {
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
