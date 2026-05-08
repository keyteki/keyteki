describe('Concussive Transfer', function () {
    describe("COncussive Transfer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['concussive-transfer'],
                    inPlay: ['foozle', 'cpo-zytar', 'flamethrower']
                },
                player2: {
                    inPlay: ['troll', 'hunting-witch', 'flaxia']
                }
            });
        });

        it('deals 3 to a creature and then redistributes all damage', function () {
            this.player1.useAction(this.flamethrower);
            this.player1.clickCard(this.huntingWitch);
            this.player1.play(this.concussiveTransfer);
            this.player1.clickCard(this.troll);
            // 6 damage was out there, all healed now.
            expect(this.troll.damage).toBe(0);
            expect(this.foozle.damage).toBe(0);
            expect(this.cpoZytar.damage).toBe(0);
            expect(this.huntingWitch.damage).toBe(0);
            expect(this.flaxia.damage).toBe(0);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.cpoZytar);
            expect(this.player1).isReadyToTakeAction();
            expect(this.troll.damage).toBe(5);
            expect(this.foozle.damage).toBe(0);
            expect(this.cpoZytar.damage).toBe(1);
            expect(this.huntingWitch.damage).toBe(0);
            expect(this.flaxia.damage).toBe(0);
        });
    });
});
