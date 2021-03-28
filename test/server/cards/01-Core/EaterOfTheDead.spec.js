describe('Eater of the Dead', function () {
    describe("Eater of the Dead's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['eater-of-the-dead'],
                    discard: ['pitlord', 'hand-of-dis']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should trigger after a fight', function () {
            this.player1.fightWith(this.eaterOfTheDead, this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            expect(this.player1).toHavePrompt('Eater of the Dead');
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.pitlord);
            expect(this.player1).not.toBeAbleToSelect(this.eaterOfTheDead);
            expect(this.player1).not.toBeAbleToSelect(this.handOfDis);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('purged');
            expect(this.eaterOfTheDead.tokens.power).toBe(1);
            expect(this.eaterOfTheDead.power).toBe(5);
        });

        it('should trigger after reaping', function () {
            this.player1.reap(this.eaterOfTheDead);
            expect(this.player1).toHavePrompt('Eater of the Dead');
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.pitlord);
            expect(this.player1).not.toBeAbleToSelect(this.eaterOfTheDead);
            expect(this.player1).not.toBeAbleToSelect(this.handOfDis);
            this.player1.clickCard(this.pitlord);
            expect(this.pitlord.location).toBe('purged');
            expect(this.eaterOfTheDead.tokens.power).toBe(1);
            expect(this.eaterOfTheDead.power).toBe(5);
        });

        it('should not trigger when there are no creatures in discard', function () {
            this.player1.moveCard(this.pitlord, 'hand');
            this.player1.reap(this.eaterOfTheDead);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
