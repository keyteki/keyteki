describe('Shrink-Ray Technician', function () {
    describe("Shrink-Ray Technician's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['shrink-ray-technician'],
                    inPlay: ['groke']
                },
                player2: {
                    inPlay: ['foozle', 'dust-pixie', 'firespitter']
                }
            });
        });

        describe('on reap', function () {
            beforeEach(function () {
                this.player1.playCreature(this.shrinkRayTechnician);
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
                this.player2.endTurn();
                this.player1.clickPrompt('mars');
                this.player1.reap(this.shrinkRayTechnician);
            });

            it('give an enemy creature -2 power', function () {
                expect(this.player1).toBeAbleToSelect(this.foozle);
                expect(this.player1).toBeAbleToSelect(this.firespitter);
                expect(this.player1).toBeAbleToSelect(this.dustPixie);
                expect(this.player1).not.toBeAbleToSelect(this.groke);
                expect(this.player1).not.toBeAbleToSelect(this.shrinkRayTechnician);
                this.player1.clickCard(this.firespitter);
                expect(this.firespitter.power).toBe(3);
                expect(this.firespitter.armor).toBe(1);
                expect(this.foozle.power).toBe(5);
                expect(this.player1).isReadyToTakeAction();
                this.player1.endTurn();
                expect(this.firespitter.power).toBe(5);
            });

            it('destroy an enemy creature with 2 or less power', function () {
                this.player1.clickCard(this.dustPixie);
                expect(this.dustPixie.location).toBe('discard');
                expect(this.player1).isReadyToTakeAction();
            });
        });

        it('gives the most powerful enemy creature 1 power and 0 armor on scrap', function () {
            this.player1.scrap(this.shrinkRayTechnician);
            expect(this.player1).toBeAbleToSelect(this.foozle);
            expect(this.player1).toBeAbleToSelect(this.firespitter);
            expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
            expect(this.player1).not.toBeAbleToSelect(this.groke);
            this.player1.clickCard(this.firespitter);
            expect(this.firespitter.power).toBe(1);
            expect(this.firespitter.armor).toBe(0);
            expect(this.foozle.power).toBe(5);
            expect(this.dustPixie.power).toBe(1);
            expect(this.dustPixie.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
