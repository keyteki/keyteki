describe('Quixo the Adventurer', function () {
    describe("Quixo the Adventurer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['quixo-the-adventurer']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should draw a card after fight', function () {
            let handSize = this.player1.hand.length;
            this.player1.fightWith(this.quixoTheAdventurer, this.bumpsy);
            expect(this.player1.hand.length).toBe(handSize + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
