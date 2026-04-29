describe('Achromatic Basilisk', function () {
    describe("Achromatic Basilisk's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['achromatic-basilisk', 'urchin']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('exhausts an enemy creature after fight', function () {
            this.player1.fightWith(this.achromaticBasilisk, this.troll);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.achromaticBasilisk);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.troll.exhausted).toBe(false);
            expect(this.krump.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot target friendly creatures', function () {
            this.player1.fightWith(this.achromaticBasilisk, this.troll);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).not.toBeAbleToSelect(this.achromaticBasilisk);
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can target an already-exhausted enemy creature', function () {
            this.krump.exhausted = true;
            this.player1.fightWith(this.achromaticBasilisk, this.troll);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.krump);
            expect(this.krump.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
