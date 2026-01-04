describe('Digital Signal', function () {
    describe("Digital Signal's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['digital-signal', 'krump', 'cpo-zytar', 'medic-ingram'],
                    inPlay: ['urchin']
                },
                player2: {
                    archives: ['troll', 'umbra', 'hunting-witch']
                }
            });
        });

        it('should archive cards equal to opponent archives and discard opponent archives', function () {
            this.player1.play(this.digitalSignal);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.cpoZytar);
            this.player1.clickCard(this.medicIngram);
            this.player1.clickPrompt('Done');
            expect(this.player1.archives.length).toBe(3);
            expect(this.player1.archives).toContain(this.krump);
            expect(this.player1.archives).toContain(this.cpoZytar);
            expect(this.player1.archives).toContain(this.medicIngram);
            expect(this.player2.archives.length).toBe(0);
            expect(this.troll.location).toBe('discard');
            expect(this.umbra.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
