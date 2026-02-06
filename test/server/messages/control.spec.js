describe('Control Messages', function () {
    describe('take control', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['sneklifter']
                },
                player2: {
                    inPlay: ['the-golden-spiral']
                }
            });
        });

        it('should log correct message when taking control of artifact', function () {
            this.player1.play(this.sneklifter);
            this.player1.clickCard(this.theGoldenSpiral);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Sneklifter',
                'player1 uses Sneklifter to take control of The Golden Spiral'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('give control', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['exile'],
                    inPlay: ['senator-shrix']
                },
                player2: {}
            });
        });

        it('should log correct message when giving control of creature', function () {
            this.player1.play(this.exile);
            this.player1.clickCard(this.senatorShrix);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Exile',
                "player1 gains an amber due to Exile's bonus icon",
                'player1 uses Exile to give control of Senator Shrix to player2'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
