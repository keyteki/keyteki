describe('Horseman of Famine', function () {
    describe("Horseman of Famine's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['horseman-of-famine'],
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['ember-imp', 'bumpsy']
                }
            });
        });

        it('should destroy the least powerful creature on play', function () {
            this.player1.play(this.horsemanOfFamine);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.horsemanOfFamine);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe("Horseman of Famine's reap/fight abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['horseman-of-famine', 'troll']
                },
                player2: {
                    inPlay: ['ember-imp', 'bumpsy']
                }
            });
        });

        it('should destroy the least powerful creature on reap', function () {
            this.player1.reap(this.horsemanOfFamine);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).not.toBeAbleToSelect(this.bumpsy);
            expect(this.player1).not.toBeAbleToSelect(this.horsemanOfFamine);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });

        it('should destroy the least powerful creature after fight', function () {
            this.player1.fightWith(this.horsemanOfFamine, this.emberImp);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.bumpsy);
            expect(this.player1).toBeAbleToSelect(this.horsemanOfFamine);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.bumpsy);
            expect(this.bumpsy.location).toBe('discard');
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
