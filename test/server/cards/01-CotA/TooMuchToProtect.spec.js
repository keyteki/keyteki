describe('Too Much To Protect', function () {
    describe("Too Much To Protect's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['too-much-to-protect']
                },
                player2: {
                    amber: 14,
                    inPlay: []
                }
            });
        });
        it('should steal all but 6 aember', function () {
            this.player1.play(this.tooMuchToProtect);
            expect(this.player1.amber).toBe(9);
            expect(this.player2.amber).toBe(6);
        });
    });
    describe("Too Much To Protect's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['too-much-to-protect']
                },
                player2: {
                    amber: 14,
                    inPlay: ['the-vaultkeeper']
                }
            });
        });
        it("shouldn't do a thing when there is anti-steal in play [Vaultkeeper]", function () {
            this.player1.play(this.tooMuchToProtect);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(14);
        });
    });
    describe("Too Much To Protect's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['too-much-to-protect']
                },
                player2: {
                    amber: 14,
                    inPlay: ['odoac-the-patrician']
                }
            });
        });
        it("shouldn't do a thing when there is anti-steal in play [Odoac]", function () {
            this.odoacThePatrician.addToken('amber', 1);
            this.player1.play(this.tooMuchToProtect);
            expect(this.player1.amber).toBe(1);
            expect(this.player2.amber).toBe(14);
        });
        it("should work when there isn't anti-steal in play [Odoac]", function () {
            this.player1.play(this.tooMuchToProtect);
            expect(this.player1.amber).toBe(9);
            expect(this.player2.amber).toBe(6);
        });
    });
});
