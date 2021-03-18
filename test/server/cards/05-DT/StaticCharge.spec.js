describe('StaticCharge', function () {
    describe("StaticCharge's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'logos',
                    hand: ['static-charge']
                },
                player2: {
                    inPlay: ['troll', 'bad-penny', 'headhunter', 'eyegor']
                }
            });
            this.player1.playUpgrade(this.staticCharge, this.badPenny);
        });

        describe('on creatures controllers turn', function () {
            beforeEach(function () {
                this.player1.endTurn();
            });

            it('2 damage done to neighbors', function () {
                expect(this.troll.tokens.damage).toBe(2);
                expect(this.badPenny.tokens.damage).toBeUndefined();
                expect(this.headhunter.tokens.damage).toBe(2);
                expect(this.eyegor.tokens.damage).toBeUndefined();
            });

            describe('on creatures controllers opponents turn', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('logos');
                    this.player2.endTurn();
                });

                it('0 damage done', function () {
                    expect(this.troll.tokens.damage).toBe(2);
                    expect(this.badPenny.tokens.damage).toBeUndefined();
                    expect(this.headhunter.tokens.damage).toBe(2);
                    expect(this.eyegor.tokens.damage).toBeUndefined();
                });
            });
        });
    });
});
