describe('Look Over There', function () {
    describe("Look Over There's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['look-over-there']
                },
                player2: {
                    amber: 1,
                    inPlay: ['dodger', 'bad-penny']
                }
            });
            this.player1.play(this.lookOverThere);
        });

        it('able to select creature', function () {
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
        });

        describe('damages 5 power creature', function () {
            beforeEach(function () {
                this.player1.clickCard(this.dodger);
            });

            it('deal damage and steal', function () {
                expect(this.player1.amber).toBe(1);
                expect(this.player2.amber).toBe(0);
                expect(this.dodger.tokens.damage).toBe(2);
                expect(this.dodger.location).toBe('play area');
                expect(this.badPenny.location).toBe('play area');
            });
        });

        describe('damages 1 power creature', function () {
            beforeEach(function () {
                this.player1.clickCard(this.badPenny);
            });

            it('deal damage, destroy and not steal', function () {
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(1);
                expect(this.dodger.tokens.damage).toBe(undefined);
                expect(this.dodger.location).toBe('play area');
                expect(this.badPenny.location).toBe('hand');
            });
        });
    });

    describe("Look Over There's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['look-over-there']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('if no creature, no steal', function () {
            this.player1.play(this.lookOverThere);
            expect(this.player1.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
