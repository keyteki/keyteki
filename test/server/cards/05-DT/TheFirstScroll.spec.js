describe('TheFirstScroll', function () {
    describe('test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['helper-bot', 'titan-mechanic', 'bad-penny', 'the-first-scroll'],
                    amber: 12
                },
                player2: {
                    inPlay: ['snufflegator', 'halacor'],
                    amber: 9
                }
            });
        });

        describe('when opponent forged their creatures should capture', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.forgeKey('Red');
            });

            it('should capture 2 amber', function () {
                expect(this.player2.amber).toBe(1);
                expect(this.snufflegator.amber).toBe(1);
                expect(this.halacor.amber).toBe(1);

                expect(this.player1.amber).toBe(12);
                expect(this.helperBot.amber).toBe(0);
                expect(this.titanMechanic.amber).toBe(0);
                expect(this.badPenny.amber).toBe(0);
                expect(this.badPenny.amber).toBe(0);
            });

            describe('when player forged their creatures should capture', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('untamed');
                    this.player2.endTurn();
                    this.player1.forgeKey('Red');
                });

                it('should capture 2 amber', function () {
                    expect(this.player2.amber).toBe(1);
                    expect(this.snufflegator.amber).toBe(1);
                    expect(this.halacor.amber).toBe(1);

                    expect(this.player1.amber).toBe(3);
                    expect(this.helperBot.amber).toBe(1);
                    expect(this.titanMechanic.amber).toBe(1);
                    expect(this.badPenny.amber).toBe(1);
                    expect(this.badPenny.amber).toBe(1);
                });
            });
        });
    });
});
