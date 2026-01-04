describe('Platopelta', function () {
    describe("Platopelta's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['curse-of-vanity', 'tribute', 'aristotlmimus'],
                    archives: ['pelf', 'bumpsy'],
                    inPlay: ['platopelta', 'socraterosaurus']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('archive a card when there are no wisdom counters', function () {
            this.player1.reap(this.platopelta);
            this.player1.clickCard(this.curseOfVanity);
            expect(this.player1.player.hand.length).toBe(2);
            expect(this.player1.player.archives.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does everything when there is a wisdom counter', function () {
            this.player1.playCreature(this.aristotlmimus, true);
            this.player1.reap(this.socraterosaurus);
            this.player1.clickCard(this.platopelta);
            this.player1.reap(this.platopelta);
            this.player1.clickCard(this.curseOfVanity);
            this.player1.clickCard(this.aristotlmimus);
            expect(this.aristotlmimus.tokens.wisdom).toBe(1);
            expect(this.player1.hand.length).toBe(3); // Draws from both, plus one unarchived card
            expect(this.player1.archives.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('choose to not place a wisdom counter', function () {
            this.player1.playCreature(this.aristotlmimus, true);
            this.player1.reap(this.socraterosaurus);
            this.player1.clickCard(this.platopelta);
            this.player1.reap(this.platopelta);
            this.player1.clickCard(this.curseOfVanity);
            this.player1.clickPrompt('Done');
            expect(this.aristotlmimus.tokens.wisdom).toBe(undefined);
            expect(this.player1.hand.length).toBe(3); // Draws from both, plus one unarchived card
            expect(this.player1.archives.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
