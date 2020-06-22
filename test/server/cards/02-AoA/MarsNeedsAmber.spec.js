describe('Mars Needs Amber', function () {
    describe("Mars Needs Amber's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['anger', 'hebe-the-huge', 'mars-needs-æmber'],
                    inPlay: ['troll', 'valdr', 'bumpsy']
                },
                player2: {
                    amber: 5,
                    inPlay: ['dextre', 'doc-bookton', 'ganymede-archivist', 'yxilx-dominator']
                }
            });
        });

        it('should have all damaged non-mars creatures capture from their side', function () {
            this.player1.play(this.hebeTheHuge);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.play(this.marsNeedsÆmber);
            expect(this.player2.amber).toBe(2);
        });
    });

    describe("Mars Needs Amber's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['anger', 'hebe-the-huge', 'mars-needs-æmber'],
                    inPlay: ['troll', 'valdr', 'bumpsy']
                },
                player2: {
                    amber: 5,
                    inPlay: ['dextre', 'bulwark', 'ganymede-archivist', 'yxilx-dominator']
                }
            });
        });

        it('should not capture if there are no undamaged, non-mars creatures', function () {
            this.player1.play(this.hebeTheHuge);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.play(this.marsNeedsÆmber);
            expect(this.player2.amber).toBe(5);
        });
    });

    describe("Mars Needs Amber's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['anger', 'hebe-the-huge', 'mars-needs-æmber'],
                    inPlay: ['troll', 'valdr', 'bumpsy']
                },
                player2: {
                    amber: 1,
                    inPlay: ['dextre', 'doc-bookton', 'ganymede-archivist', 'yxilx-dominator']
                }
            });
        });

        it("should give a prompt to pick a creature if there's not enough amber for every creature", function () {
            this.player1.play(this.hebeTheHuge);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.play(this.marsNeedsÆmber);
            expect(this.player1).toHavePrompt('Mars Needs Æmber');
            expect(this.player1).toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.docBookton);
            expect(this.player1).toBeAbleToSelect(this.ganymedeArchivist);
            expect(this.player1).not.toBeAbleToSelect(this.yxilxDominator);
            expect(this.player2.amber).toBe(1);
            this.player1.clickCard(this.dextre);
            expect(this.player2.amber).toBe(0);
            expect(this.dextre.tokens.amber).toBe(1);
        });
    });
});
