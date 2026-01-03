describe('Ruthless Avenger', function () {
    describe("Ruthless Avenger's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'redemption',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['ruthless-avenger']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia'],
                    discard: ['poke', 'batdrone', 'helper-bot']
                }
            });
        });

        it('should purge 2 random cards and shuffle discard into deck when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.ruthlessAvenger);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            const p2DeckLength = this.player2.deck.length;
            this.player2.reap(this.flaxia);
            expect(this.player2.discard.length).toBe(0);
            expect(this.player2.deck.length).toBe(p2DeckLength + 1);
            expect(this.player2.player.purged.length).toBe(2);
            expect(this.ruthlessAvenger.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
