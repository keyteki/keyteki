describe('De-escalation', function () {
    describe("De-escalation's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['de-escalation'],
                    inPlay: ['gemcoat-vendor']
                },
                player2: {
                    amber: 1,
                    inPlay: ['cpo-zytar', 'master-of-1', 'master-of-2'],
                    discard: ['stealth-mode', 'timetraveller', 'rogue-operation']
                }
            });
        });

        it('destroys all creatures and archives top 3 for opponent', function () {
            this.player2.moveCard(this.stealthMode, 'deck');
            this.player2.moveCard(this.timetraveller, 'deck');
            this.player2.moveCard(this.rogueOperation, 'deck');
            this.player1.play(this.deEscalation);
            expect(this.gemcoatVendor.location).toBe('discard');
            expect(this.cpoZytar.location).toBe('discard');
            expect(this.masterOf1.location).toBe('discard');
            expect(this.masterOf2.location).toBe('discard');
            expect(this.player2.player.archives.length).toBe(3);
            expect(this.stealthMode.location).toBe('archives');
            expect(this.timetraveller.location).toBe('archives');
            expect(this.rogueOperation.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('can archive less than 3 for opponent', function () {
            this.player2.player.deck = [];
            this.player2.moveCard(this.stealthMode, 'deck');
            this.player1.play(this.deEscalation);
            expect(this.player2.player.archives.length).toBe(1);
            expect(this.stealthMode.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
