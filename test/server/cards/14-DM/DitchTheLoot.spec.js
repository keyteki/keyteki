describe('Ditch the Loot', function () {
    describe("Ditch the Loot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['ditch-the-loot'],
                    inPlay: ['urchin', 'hobnobber']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
            this.urchin.amber = 3;
        });

        it('moves all amber from one creature to another', function () {
            this.player1.play(this.ditchTheLoot);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.hobnobber);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.hobnobber);
            expect(this.urchin.amber).toBe(0);
            expect(this.hobnobber.amber).toBe(3);
            expect(this.troll.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can move amber to an enemy creature', function () {
            this.player1.play(this.ditchTheLoot);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.troll);
            expect(this.urchin.amber).toBe(0);
            expect(this.hobnobber.amber).toBe(0);
            expect(this.troll.amber).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target creatures with no amber on them', function () {
            this.player1.play(this.ditchTheLoot);
            expect(this.player1).toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.hobnobber);
            expect(this.player1).toBeAbleToSelect(this.troll);
        });
    });
});
