describe('The Evil in the Ranks', function () {
    describe("The Evil in the Ranks' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['troll', 'lollop-the-titanic', 'krump', 'bingle-bangbang']
                },
                player2: {
                    house: 'keyraken',
                    hand: ['the-evil-in-the-ranks']
                }
            });
        });

        it('each enemy flank creature deals damage to its neighbor equal to its power', function () {
            this.player1.playCreature(this.troll);
            this.player1.playCreature(this.lollopTheTitanic);
            this.player1.playCreature(this.krump);
            this.player1.playCreature(this.bingleBangbang);
            this.player1.endTurn();
            this.player2.clickPrompt('keyraken');
            this.player2.play(this.theEvilInTheRanks);
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.lollopTheTitanic.tokens.damage).toBe(8);
            expect(this.krump.tokens.damage).toBe(2);
            expect(this.bingleBangbang.tokens.damage).toBe(undefined);
            expect(this.player2).isReadyToTakeAction();
        });

        it('all damage is dealt before destruction', function () {
            this.player1.playCreature(this.troll);
            this.player1.playCreature(this.lollopTheTitanic);
            this.player1.playCreature(this.krump);
            this.player1.endTurn();
            this.player2.clickPrompt('keyraken');
            this.player2.play(this.theEvilInTheRanks);
            expect(this.troll.tokens.damage).toBe(undefined);
            expect(this.lollopTheTitanic.location).toBe('discard');
            expect(this.krump.tokens.damage).toBe(undefined);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
