describe('Rustgnawer', function () {
    describe("Rustgnawer's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'untamed',
                    inPlay: ['rustgnawer', 'brain-eater'],
                    hand: ['cauldron-boil']
                },
                player2: {
                    inPlay: ['dextre', 'screechbomb', 'grump-buggy', 'mother', 'nexus']
                }
            });
        });

        it('should prompt to destroy an artifact when it fights, and return the amber value to the controller. [0]', function () {
            this.player1.fightWith(this.rustgnawer, this.nexus);
            expect(this.player1).toHavePrompt('Rustgnawer');
            expect(this.player1).toBeAbleToSelect(this.screechbomb);
            expect(this.player1).toBeAbleToSelect(this.grumpBuggy);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.screechbomb);
            expect(this.player1.amber).toBe(1);
        });

        it('should prompt to destroy an artifact when it fights, and return the amber value to the controller. [2]', function () {
            this.player1.fightWith(this.rustgnawer, this.nexus);
            expect(this.player1).toHavePrompt('Rustgnawer');
            expect(this.player1).toBeAbleToSelect(this.screechbomb);
            expect(this.player1).toBeAbleToSelect(this.grumpBuggy);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.grumpBuggy);
            expect(this.player1.amber).toBe(2);
        });

        it('should prompt to destroy an artifact when it fights, and return the amber value to the controller, considering enhancements. [0]', function () {
            this.screechbomb.cardData.enhancements = ['amber', 'amber', 'amber', 'draw', 'capture'];

            this.player1.fightWith(this.rustgnawer, this.nexus);
            expect(this.player1).toHavePrompt('Rustgnawer');
            expect(this.player1).toBeAbleToSelect(this.screechbomb);
            expect(this.player1).toBeAbleToSelect(this.grumpBuggy);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            this.player1.clickCard(this.screechbomb);
            expect(this.player1.amber).toBe(4);
        });
    });
});
