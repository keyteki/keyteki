describe('Almsmaster', function () {
    describe('When played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['almsmaster'],
                    inPlay: ['helper-bot', 'titan-mechanic', 'bad-penny']
                },
                player2: {
                    inPlay: ['snufflegator', 'halacor'],
                    amber: 2
                }
            });
        });

        describe('next to two creatures', function () {
            beforeEach(function () {
                this.player1.playCreature(this.almsmaster, true, true);
                this.player1.clickCard(this.titanMechanic);
            });

            it('should capture 2 amber', function () {
                expect(this.player2.amber).toBe(0);
                expect(this.titanMechanic.amber).toBe(1);
                expect(this.helperBot.amber).toBe(1);
            });
        });

        describe('next to only one creature', function () {
            beforeEach(function () {
                this.player1.playCreature(this.almsmaster, true, true);
                this.player1.clickCard(this.helperBot);
            });

            it('should capture 1 amber', function () {
                expect(this.player2.amber).toBe(1);
                expect(this.helperBot.amber).toBe(1);
            });
        });
    });
});
