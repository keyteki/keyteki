describe("Stenter's Formula", function () {
    describe("Stenter's Formula's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['stenter-s-formula'],
                    inPlay: ['dextre', 'troll', 'krump']
                },
                player2: {
                    inPlay: ['ancient-bear', 'dust-pixie']
                }
            });
        });

        it('should ward up to 3 creatures and draw a card', function () {
            this.player1.play(this.stenterSFormula);
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.krump);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            this.player1.clickCard(this.dextre);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.krump);
            this.player1.clickPrompt('Done');
            expect(this.dextre.warded).toBe(true);
            expect(this.troll.warded).toBe(true);
            expect(this.krump.warded).toBe(true);
            expect(this.ancientBear.warded).toBe(false);
            expect(this.dustPixie.warded).toBe(false);
            expect(this.player1.player.hand.length).toBe(1); // Drew 1 card
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should allow selecting fewer than 3 creatures', function () {
            this.player1.play(this.stenterSFormula);
            this.player1.clickCard(this.dextre);
            this.player1.clickPrompt('Done');
            expect(this.dextre.warded).toBe(true);
            expect(this.dustPixie.warded).toBe(false);
            expect(this.krump.warded).toBe(false);
            expect(this.ancientBear.warded).toBe(false);
            expect(this.player1.hand.length).toBe(1); // Drew 1 card
        });
    });
});
