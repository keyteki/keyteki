describe('Race to the Surface', function () {
    describe("Race to the Surface's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'keyraken',
                    hand: [
                        'race-to-the-surface',
                        'ancient-bear',
                        'crushing-tentacle',
                        'grappling-tentacle',
                        'krump',
                        'left-in-its-wake',
                        'troll'
                    ]
                },
                player2: {}
            });
            this.player1.moveCard(this.troll, 'deck'); // bottom
            this.player1.moveCard(this.leftInItsWake, 'deck');
            this.player1.moveCard(this.krump, 'deck');
            this.player1.moveCard(this.grapplingTentacle, 'deck');
            this.player1.moveCard(this.crushingTentacle, 'deck');
            this.player1.moveCard(this.ancientBear, 'deck'); // top card of deck
        });

        it('discards top 5 cards and archives keyraken cards', function () {
            this.player1.play(this.raceToTheSurface);
            expect(this.ancientBear.location).toBe('discard');
            expect(this.crushingTentacle.location).toBe('archives');
            expect(this.grapplingTentacle.location).toBe('archives');
            expect(this.krump.location).toBe('discard');
            expect(this.leftInItsWake.location).toBe('archives');
            expect(this.troll.location).toBe('deck');
            expect(this.player1.discard.length).toBe(3);
            expect(this.player1.archives.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
