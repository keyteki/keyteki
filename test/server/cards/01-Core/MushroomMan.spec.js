describe('Mushroom Man', function () {
    describe("Mushroom Man's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 10,
                    inPlay: ['mushroom-man', 'niffle-ape'],
                    hand: ['key-charge']
                },
                player2: {
                    amber: 7,
                    hand: ['hypnobeam', 'mimic-gel', 'effervescent-principle']
                }
            });
        });

        it('should get +3 power for each unforged key', function () {
            expect(this.niffleApe.power).toBe(3);
            expect(this.mushroomMan.power).toBe(11);
        });

        it('should decrease power when key is forged', function () {
            this.player1.play(this.keyCharge);
            this.player1.clickPrompt('Yes');
            this.player1.forgeKey('Red');
            this.player1.endTurn();
            expect(this.mushroomMan.power).toBe(8);
        });

        it("should look at controller's keys when taken control", function () {
            this.player1.endTurn();
            this.player2.forgeKey('Blue');
            this.player2.clickPrompt('mars');
            this.player2.play(this.hypnobeam);
            this.player2.clickCard(this.mushroomMan);
            expect(this.mushroomMan.power).toBe(8);
        });

        it("should look at controller's keys when cloned by Mimic Gel", function () {
            this.player1.endTurn();
            this.player2.forgeKey('Blue');
            this.player2.clickPrompt('logos');
            this.player2.play(this.mimicGel);
            this.player2.clickCard(this.mushroomMan);
            expect(this.mushroomMan.power).toBe(11);
            expect(this.mimicGel.power).toBe(8);
        });
    });
});
