describe('Aristotlmimus', function () {
    describe("Aristotlmimus's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    hand: ['curse-of-vanity', 'tribute'],
                    archives: ['pelf', 'bumpsy', 'rant-and-rive'],
                    inPlay: ['aristotlmimus', 'platopelta', 'socraterosaurus']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('play a creature card from archives when there are no wisdom counters', function () {
            this.player1.reap(this.aristotlmimus);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Right');
            expect(this.bumpsy.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay.length).toBe(4);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('play an action card from archives when there are no wisdom counters', function () {
            this.player1.reap(this.aristotlmimus);
            this.player1.clickCard(this.rantAndRive);
            expect(this.rantAndRive.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('allow not playing a card from archives when there are no wisdom counters', function () {
            this.player1.reap(this.aristotlmimus);
            this.player1.clickPrompt('Done');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does everything when there is a wisdom counter', function () {
            this.player1.reap(this.socraterosaurus);
            this.player1.clickCard(this.platopelta);
            this.player1.reap(this.platopelta);
            this.player1.clickCard(this.curseOfVanity);
            this.player1.clickCard(this.aristotlmimus);
            this.player1.reap(this.aristotlmimus);
            this.player1.clickCard(this.tribute);
            this.player1.clickCard(this.bumpsy);
            this.player1.clickPrompt('Right');
            expect(this.player1.hand.length).toBe(3); // Draws from all three
            expect(this.player1.archives.length).toBe(4);
            expect(this.player1.player.creaturesInPlay.length).toBe(4);
            expect(this.player2.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can play the card it archives that turn', function () {
            this.player1.reap(this.socraterosaurus);
            this.player1.clickCard(this.platopelta);
            this.player1.reap(this.platopelta);
            this.player1.clickCard(this.curseOfVanity);
            this.player1.clickCard(this.aristotlmimus);

            this.player1.reap(this.aristotlmimus);
            this.player1.clickCard(this.tribute);
            this.player1.clickCard(this.tribute);
            this.player1.clickCard(this.platopelta);
            this.player1.clickPrompt('No'); // tribute exalt

            expect(this.player1.hand.length).toBe(3); // Draws from all three
            expect(this.player1.archives.length).toBe(4);
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player2.amber).toBe(0);
            expect(this.platopelta.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
