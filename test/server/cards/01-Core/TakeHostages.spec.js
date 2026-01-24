describe('Take Hostages', function () {
    describe("Take Hostages' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'sanctum',
                    hand: ['take-hostages'],
                    inPlay: ['commander-remiel', 'bulwark', 'bordan-the-redeemed']
                },
                player2: {
                    amber: 2,
                    inPlay: ['urchin', 'lamindra']
                }
            });
        });

        it('should capture 1A when friendly creature fights', function () {
            this.player1.play(this.takeHostages);
            this.player1.fightWith(this.commanderRemiel, this.urchin);
            expect(this.commanderRemiel.amber).toBe(1);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should capture for each fight', function () {
            this.player1.play(this.takeHostages);
            this.player1.fightWith(this.commanderRemiel, this.urchin);
            expect(this.commanderRemiel.amber).toBe(1);
            expect(this.bulwark.amber).toBe(0);
            expect(this.player2.amber).toBe(1);
            this.player1.fightWith(this.bulwark, this.urchin);
            expect(this.commanderRemiel.amber).toBe(1);
            expect(this.bulwark.amber).toBe(1);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should only last until end of turn', function () {
            this.player1.play(this.takeHostages);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.fightWith(this.urchin, this.bordanTheRedeemed);
            expect(this.urchin.amber).toBe(0);
            expect(this.bordanTheRedeemed.amber).toBe(0);
            this.player2.endTurn();
            this.player1.clickPrompt('sanctum');
            this.player1.fightWith(this.bordanTheRedeemed, this.urchin);
            expect(this.bordanTheRedeemed.amber).toBe(0);
            expect(this.player2.amber).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
