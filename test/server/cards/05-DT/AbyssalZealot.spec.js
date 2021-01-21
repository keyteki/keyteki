describe('Abyssal Zealot', function () {
    describe('when owner raise the tide', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    inPlay: ['abyssal-zealot']
                },
                player2: {
                    amber: 4,
                    inPlay: ['murkens']
                }
            });

            this.player1.raiseTide();
        });

        it('should capture 2A', function () {
            expect(this.abyssalZealot.amber).toBe(2);
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(2);
        });

        describe('when opponent raise the tide', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.raiseTide();
            });

            it('should remove 2A from the creature', function () {
                expect(this.abyssalZealot.amber).toBe(0);
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(2);
            });
        });
    });
});
