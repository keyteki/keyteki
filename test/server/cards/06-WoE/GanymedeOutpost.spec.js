describe('Ganymede Outpost', function () {
    describe("Ganymede Outpost's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['com-officer-kirby', 'ganymede-outpost'],
                    hand: ['pelf', 'helmsman-spears', 'quixxle-stone']
                },
                player2: {
                    inPlay: ['kelifi-dragon']
                }
            });
        });

        it('put a creature on the bottom of your deck and archive two cards', function () {
            this.player1.useAction(this.ganymedeOutpost);
            this.player1.clickCard(this.comOfficerKirby);
            this.player1.clickCard(this.pelf);
            this.player1.clickCard(this.quixxleStone);
            this.player1.clickPrompt('Done');
            expect(this.comOfficerKirby.location).toBe('deck');
            expect(this.pelf.location).toBe('archives');
            expect(this.quixxleStone.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('put a creature on the bottom of your deck and archive one card', function () {
            this.player1.moveCard(this.helmsmanSpears, 'discard');
            this.player1.moveCard(this.quixxleStone, 'discard');
            this.player1.useAction(this.ganymedeOutpost);
            this.player1.clickCard(this.comOfficerKirby);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Done');
            expect(this.comOfficerKirby.location).toBe('deck');
            expect(this.pelf.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should fizzle with no creatures in play', function () {
            this.player1.fightWith(this.comOfficerKirby, this.kelifiDragon);
            this.player1.useAction(this.ganymedeOutpost);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
