describe('Buzzle', function () {
    describe("Buzzle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['buzzle'],
                    inPlay: ['dust-imp'],
                    discard: ['pitlord', 'hand-of-dis']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should trigger when played', function () {
            this.player1.play(this.buzzle);
            expect(this.player1).toHavePrompt('Buzzle');
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).not.toBeAbleToSelect(this.buzzle);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.dustImp);
            expect(this.dustImp.location).toBe('purged');
            expect(this.buzzle.exhausted).toBe(false);
        });

        it('should be able to not purge after play', function () {
            this.player1.play(this.buzzle);
            expect(this.player1).toHavePrompt('Buzzle');
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).not.toBeAbleToSelect(this.buzzle);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickPrompt('Done');
            expect(this.buzzle.exhausted).toBe(true);
        });
    });

    describe("Buzzle's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['dust-imp', 'buzzle', 'overlord-greking'],
                    discard: ['pitlord', 'hand-of-dis']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should trigger when fighting', function () {
            this.player1.fightWith(this.buzzle, this.batdrone);
            expect(this.player1).toHavePrompt('Buzzle');
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).toBeAbleToSelect(this.overlordGreking);
            expect(this.player1).not.toBeAbleToSelect(this.buzzle);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.overlordGreking);
            expect(this.overlordGreking.location).toBe('purged');
            expect(this.buzzle.exhausted).toBe(false);
            expect(this.batdrone.location).toBe('discard');
        });

        it('should not ready if purged a warded creatured', function () {
            this.overlordGreking.ward();
            this.player1.fightWith(this.buzzle, this.batdrone);
            this.player1.clickCard(this.overlordGreking);
            expect(this.overlordGreking.warded).toBe(false);
            expect(this.overlordGreking.location).toBe('play area');
            expect(this.buzzle.exhausted).toBe(true);
            expect(this.batdrone.location).toBe('discard');
        });

        it('should be able to not purge after fight', function () {
            this.player1.fightWith(this.buzzle, this.batdrone);
            expect(this.player1).toHavePrompt('Buzzle');
            expect(this.player1).toBeAbleToSelect(this.dustImp);
            expect(this.player1).toBeAbleToSelect(this.overlordGreking);
            expect(this.player1).not.toBeAbleToSelect(this.buzzle);
            expect(this.player1).not.toBeAbleToSelect(this.batdrone);
            this.player1.clickPrompt('Done');
            expect(this.buzzle.exhausted).toBe(true);
        });
    });
});
