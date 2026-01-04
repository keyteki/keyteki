describe('Ravening Morphazoid', function () {
    describe("Ravening Morphazoid's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'ekwidon',
                    hand: ['auction-off', 'mass-buyout'],
                    inPlay: ['ravening-morphazoid'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['troll', 'old-bruno']
                }
            });
        });

        it('draws a card and discards a card on reap', function () {
            this.player1.reap(this.raveningMorphazoid);
            expect(this.player1.player.hand.length).toBe(3);
            this.player1.clickCard(this.auctionOff);
            expect(this.auctionOff.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('draws a card and discards a card on fight', function () {
            this.player1.fightWith(this.raveningMorphazoid, this.oldBruno);
            expect(this.player1.player.hand.length).toBe(3);
            this.player1.clickCard(this.auctionOff);
            expect(this.auctionOff.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not give poison and skirmish when not haunted', function () {
            this.player1.fightWith(this.raveningMorphazoid, this.troll);
            expect(this.raveningMorphazoid.location).toBe('discard');
            expect(this.troll.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should give poison and skirmish when haunted', function () {
            this.player1.play(this.auctionOff);
            this.player1.fightWith(this.raveningMorphazoid, this.troll);
            expect(this.raveningMorphazoid.location).toBe('play area');
            expect(this.troll.location).toBe('discard');
            expect(this.player1.player.hand.length).toBe(2);
            this.player1.clickCard(this.massBuyout);
            expect(this.massBuyout.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
