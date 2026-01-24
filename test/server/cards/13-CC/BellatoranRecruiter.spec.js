describe('Bellatoran Recruiter', function () {
    describe("Bellatoran Recruiter's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['bellatoran-recruiter', 'charette', 'gub', 'legatus-raptor']
                },
                player2: {
                    inPlay: ['umbra', 'krump']
                }
            });
        });

        it('should give +2 power and +2 armor to a friendly non-Dinosaur creature after fighting', function () {
            this.charette.exhausted = true;
            this.player1.fightWith(this.bellatoranRecruiter, this.umbra);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.legatusRaptor);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.charette);
            expect(this.charette.power).toBe(6);
            expect(this.charette.armor).toBe(2);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('discard');
            expect(this.charette.damage).toBe(4);
            expect(this.player1).isReadyToTakeAction();
            this.player1.endTurn();
            expect(this.charette.location).toBe('discard');
        });

        it('should give +2 power and +2 armor to a friendly non-Dinosaur creature after reaping', function () {
            this.charette.exhausted = true;
            this.player1.reap(this.bellatoranRecruiter);
            expect(this.player1).toBeAbleToSelect(this.charette);
            expect(this.player1).toBeAbleToSelect(this.gub);
            expect(this.player1).not.toBeAbleToSelect(this.legatusRaptor);
            expect(this.player1).not.toBeAbleToSelect(this.krump);
            this.player1.clickCard(this.charette);
            expect(this.charette.power).toBe(6);
            expect(this.charette.armor).toBe(2);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.krump);
            expect(this.krump.location).toBe('discard');
            expect(this.charette.damage).toBe(4);
            expect(this.player1).isReadyToTakeAction();
            this.player1.endTurn();
            expect(this.charette.location).toBe('discard');
        });
    });
});
