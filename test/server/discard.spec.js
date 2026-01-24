describe('Discard', function () {
    describe('Discard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    hand: ['new-frontiers', 'boiler', 'medic-ingram'],
                    inPlay: ['echofly']
                },
                player2: {
                    hand: ['open-the-seal'],
                    inPlay: ['thing-from-the-deep']
                }
            });
        });

        it('can fire scrap abilities', function () {
            this.newFrontiers.enhancements = ['discard'];
            this.player1.play(this.newFrontiers);
            expect(this.player1).toBeAbleToSelect(this.boiler);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).not.toBeAbleToSelect(this.echofly);
            expect(this.player1).not.toBeAbleToSelect(this.newFrontiers);
            expect(this.player1).not.toBeAbleToSelect(this.thingFromTheDeep);
            expect(this.player1).not.toBeAbleToSelect(this.openTheSeal);
            this.player1.clickCard(this.boiler);
            expect(this.boiler.location).toBe('discard');
            expect(this.thingFromTheDeep.damage).toBe(1);
            expect(this.echofly.damage).toBe(0);
        });
    });
});
