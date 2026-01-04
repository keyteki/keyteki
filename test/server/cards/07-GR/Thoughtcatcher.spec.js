describe('Thoughtcatcher', function () {
    describe("Thoughtcatcher's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    inPlay: ['echofly', 'miss-chievous', 'flaxia', 'thoughtcatcher']
                },
                player2: {
                    amber: 1,
                    inPlay: ['thing-from-the-deep', 'dust-pixie']
                }
            });
        });

        it('draws a card for friendly creatures with amber on them on destroy', function () {
            let p1hand = this.player1.player.hand.length;
            this.echofly.amber = 1;
            this.player1.fightWith(this.echofly, this.thingFromTheDeep);
            expect(this.player1.player.hand.length).toBe(p1hand + 1);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not draw a card for creatures without amber on them on destroy', function () {
            let p1hand = this.player1.player.hand.length;
            this.player1.fightWith(this.echofly, this.thingFromTheDeep);
            expect(this.player1.player.hand.length).toBe(p1hand);
            expect(this.echofly.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not draw a card for enemy creatures with amber on them on destroy', function () {
            let p2hand = this.player2.player.hand.length;
            this.dustPixie.amber = 1;
            this.player1.fightWith(this.echofly, this.dustPixie);
            expect(this.player2.player.hand.length).toBe(p2hand);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
