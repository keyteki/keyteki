describe('Undagnathus', function () {
    describe("Undagnathus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['grommid', 'mega-narp']
                },
                player2: {
                    inPlay: ['undagnathus']
                }
            });
        });

        describe('while the tide is neutral', function () {
            it('should deal damage when defending', function () {
                this.player1.fightWith(this.megaNarp, this.undagnathus);
                expect(this.megaNarp.location).toBe('discard');
                expect(this.undagnathus.tokens.damage).toBe(10);
            });

            it('should deal damage when attacking', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('saurian');
                this.player2.fightWith(this.undagnathus, this.megaNarp);
                expect(this.megaNarp.location).toBe('discard');
                expect(this.undagnathus.tokens.damage).toBe(10);
            });
        });

        describe('while the tide is low', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            it('should not deal damage when defending', function () {
                this.player1.fightWith(this.megaNarp, this.undagnathus);
                expect(this.megaNarp.location).toBe('play area');
                expect(this.megaNarp.tokens.damage).toBeUndefined();
                expect(this.undagnathus.tokens.damage).toBe(10);
            });

            it('should not deal damage when attacking', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('saurian');
                this.player2.fightWith(this.undagnathus, this.megaNarp);
                expect(this.megaNarp.location).toBe('play area');
                expect(this.megaNarp.tokens.damage).toBeUndefined();
                expect(this.undagnathus.tokens.damage).toBe(10);
            });
        });

        describe('while the tide is high', function () {
            beforeEach(function () {
                this.player1.lowerTide();
            });

            it('should deal damage when defending', function () {
                this.player1.fightWith(this.megaNarp, this.undagnathus);
                expect(this.megaNarp.location).toBe('discard');
                expect(this.undagnathus.tokens.damage).toBe(10);
            });

            it('should deal damage when attacking', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('saurian');
                this.player2.fightWith(this.undagnathus, this.megaNarp);
                expect(this.megaNarp.location).toBe('discard');
                expect(this.undagnathus.tokens.damage).toBe(10);
            });
        });
    });
});
