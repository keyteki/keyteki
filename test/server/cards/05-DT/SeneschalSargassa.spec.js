describe('SeneschalSargassa', function () {
    describe('Ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['helper-bot', 'titan-mechanic', 'bad-penny', 'seneschal-sargassa'],
                    amber: 2
                },
                player2: {
                    inPlay: ['snufflegator', 'halacor'],
                    amber: 2
                }
            });
        });

        describe('when player raises the tide', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                expect(this.player1).toBeAbleToSelect(this.helperBot);
                expect(this.player1).toBeAbleToSelect(this.titanMechanic);
                expect(this.player1).toBeAbleToSelect(this.badPenny);
                expect(this.player1).toBeAbleToSelect(this.seneschalSargassa);
                expect(this.player1).not.toBeAbleToSelect(this.snufflegator);
                expect(this.player1).not.toBeAbleToSelect(this.halacor);
                this.player1.clickCard(this.badPenny);
            });

            it('should capture 2 amber onto friendly creature', function () {
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(0);
                expect(this.badPenny.amber).toBe(2);
            });
        });

        describe('when opponent raises the tide', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.raiseTide();
                expect(this.player2).not.toBeAbleToSelect(this.helperBot);
                expect(this.player2).not.toBeAbleToSelect(this.titanMechanic);
                expect(this.player2).not.toBeAbleToSelect(this.badPenny);
                expect(this.player2).not.toBeAbleToSelect(this.seneschalSargassa);
                expect(this.player2).toBeAbleToSelect(this.snufflegator);
                expect(this.player2).toBeAbleToSelect(this.halacor);
                this.player2.clickCard(this.halacor);
            });

            it('should capture 2 amber onto friendly creature', function () {
                expect(this.player1.amber).toBe(0);
                expect(this.player2.amber).toBe(2);
                expect(this.halacor.amber).toBe(2);
            });
        });
    });
});
