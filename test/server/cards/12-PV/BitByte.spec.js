describe('Bit Byte', function () {
    describe("Bit Byte's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['bit-byte'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    discard: ['draining-touch', 'searine']
                },
                player2: {
                    amber: 3,
                    inPlay: ['flaxia']
                }
            });
        });

        it('should archive the creature it fights', function () {
            this.player1.playCreature(this.bitByte);
            this.bitByte.exhausted = false;
            this.player1.fightWith(this.bitByte, this.flaxia);
            expect(this.flaxia.location).toBe('archives');
            expect(this.player2.player.archives).toContain(this.flaxia);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should archive the bottom card of opponents deck when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.bitByte);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player1.player.deck = [];
            this.player1.moveCard(this.drainingTouch, 'deck');
            this.player1.moveCard(this.searine, 'deck');
            this.player2.reap(this.flaxia);
            expect(this.drainingTouch.location).toBe('archives');
            expect(this.searine.location).toBe('deck');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
