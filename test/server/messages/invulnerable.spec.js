describe('Invulnerable Messages', function () {
    describe('fight against invulnerable creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['nizak-the-forgotten']
                }
            });
        });

        it('should log fight message when attacking invulnerable creature', function () {
            this.player1.fightWith(this.troll, this.nizakTheForgotten);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Troll to make Troll fight Nizak, The Forgotten'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
