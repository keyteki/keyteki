describe("Yondar's Log", function () {
    describe("Yondar's Log's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['yondar-s-log', 'krump', 'ember-imp', 'medic-ingram'],
                    inPlay: ['snarette']
                },
                player2: {
                    inPlay: ['troll', 'umbra', 'hunting-witch']
                }
            });
        });

        it('should archive all cards from hand when there are more enemy creatures', function () {
            this.player1.play(this.yondarSLog);
            expect(this.player1.player.hand.length).toBe(0);
            expect(this.player1.player.archives.length).toBe(3);
            expect(this.player1.player.archives).toContain(this.krump);
            expect(this.player1.player.archives).toContain(this.emberImp);
            expect(this.player1.player.archives).toContain(this.medicIngram);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not archive any cards when there are not more enemy creatures', function () {
            this.player2.moveCard(this.umbra, 'discard');
            this.player2.moveCard(this.huntingWitch, 'discard');
            this.player2.moveCard(this.troll, 'discard');
            this.player1.play(this.yondarSLog);
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player1.player.archives.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not archive any cards when there are equal numbers of creatures', function () {
            this.player2.moveCard(this.umbra, 'discard');
            this.player2.moveCard(this.troll, 'discard');
            this.player1.play(this.yondarSLog);
            expect(this.player1.player.hand.length).toBe(3);
            expect(this.player1.player.archives.length).toBe(0);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
