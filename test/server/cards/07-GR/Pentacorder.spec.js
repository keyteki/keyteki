describe('Pentacorder', function () {
    describe("Pentacorder's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 10,
                    house: 'staralliance',
                    hand: ['pentacorder', 'lieutenant-khrkhar'],
                    inPlay: ['mother']
                },
                player2: {
                    amber: 7,
                    hand: ['hypnobeam'],
                    inPlay: ['urchin', 'hunting-witch', 'john-smyth']
                }
            });
        });

        it('should increase key cost by 1 when it is attached to a creature', function () {
            this.player1.playUpgrade(this.pentacorder, this.mother);
            this.player1.endTurn();
            this.player2.forgeKey('red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.player.amber).toBe(0);
        });

        it('should increase key cost by 2 when a creature of another house is played', function () {
            this.player1.playUpgrade(this.pentacorder, this.mother);
            this.player1.playCreature(this.lieutenantKhrkhar);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            expect(this.player2.player.getForgedKeys()).toBe(0);
            expect(this.player2.player.amber).toBe(7);
        });

        it('should work against you when placed on an enemy creature', function () {
            this.player1.playUpgrade(this.pentacorder, this.urchin);
            this.player1.endTurn();
            this.player2.forgeKey('red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.player.amber).toBe(1);
            this.player2.clickPrompt('shadows');
            this.player2.endTurn();
            this.player1.forgeKey('red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.player.amber).toBe(1);
        });

        it('has no upper limit', function () {
            this.player1.playUpgrade(this.pentacorder, this.urchin);
            this.player1.endTurn();
            this.player2.forgeKey('red');
            expect(this.player2.player.getForgedKeys()).toBe(1);
            expect(this.player2.player.amber).toBe(1);
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.mother);
            this.player2.clickPrompt('Left');
            this.player2.endTurn();
            this.player1.forgeKey('red');
            expect(this.player1.player.getForgedKeys()).toBe(1);
            expect(this.player1.player.amber).toBe(0);
        });
    });
});
