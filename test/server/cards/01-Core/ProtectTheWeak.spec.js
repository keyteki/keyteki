describe('Protect the Weak', function () {
    describe("Protect the Weak's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['protect-the-weak'],
                    inPlay: ['commander-remiel']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should give attached creature +1 armor and taunt', function () {
            this.player1.playUpgrade(this.protectTheWeak, this.commanderRemiel);
            expect(this.commanderRemiel.armor).toBe(1);
            expect(this.commanderRemiel.getKeywordValue('taunt')).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
