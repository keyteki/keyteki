describe('Grave Bounty', function () {
    describe("Grave Bounty's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'dis',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['grave-bounty'],
                    discard: ['ancient-bear', 'dust-pixie']
                },
                player2: {
                    amber: 4,
                    inPlay: ['krump'],
                    discard: ['troll', 'seeker-needle', 'anger']
                }
            });
        });

        it('should purge a card and make opponent lose 2 amber when played', function () {
            this.player1.play(this.graveBounty);
            expect(this.player1).toBeAbleToSelect(this.ancientBear);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.seekerNeedle);
            expect(this.player1).not.toBeAbleToSelect(this.anger);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('purged');
            expect(this.player2.amber).toBe(2);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should purge top 2 cards when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.graveBounty);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.player2.discard.length).toBe(1);
            expect(this.troll.location).toBe('purged');
            expect(this.seekerNeedle.location).toBe('purged');
            expect(this.anger.location).toBe('discard');
            expect(this.graveBounty.location).toBe('discard');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
