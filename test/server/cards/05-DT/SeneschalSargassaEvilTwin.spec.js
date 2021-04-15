describe('SeneschalSargassaEvilTwin', function () {
    describe('Ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: [
                        'helper-bot',
                        'titan-mechanic',
                        'bad-penny',
                        'seneschal-sargassa-evil-twin'
                    ],
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
            });

            it('should capture 2 amber onto friendly creature', function () {
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(0);
                expect(this.seneschalSargassaEvilTwin.amber).toBe(2);
            });
        });

        describe('when opponent raises the tide', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('untamed');
                this.player2.raiseTide();
            });

            it('should capture 2 amber onto friendly creature', function () {
                expect(this.player1.amber).toBe(2);
                expect(this.player2.amber).toBe(0);
                expect(this.seneschalSargassaEvilTwin.amber).toBe(2);
            });
        });
    });
});
