describe('Sergeant Zakiel', function () {
    describe("Sergeant Zakiel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    hand: ['sergeant-zakiel'],
                    inPlay: ['bulwark', 'sequis']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it('should be able to ready and fight with a neighbor', function () {
            this.sequis.exhaust();
            this.player1.playCreature(this.sergeantZakiel);
            this.player1.clickCard(this.sergeantZakiel);
            this.player1.clickCard(this.sequis);
            this.player1.clickCard(this.bumpsy);
            expect(this.sequis.exhausted).toBe(true);
            expect(this.bulwark.tokens.damage).toBe(undefined);
            expect(this.sequis.tokens.damage).toBe(1);
            expect(this.sergeantZakiel.tokens.damage).toBe(undefined);
            expect(this.bumpsy.tokens.damage).toBe(4);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should allow declining the ability', function () {
            this.player1.playCreature(this.sergeantZakiel);
            this.player1.clickPrompt('Done');
            expect(this.sequis.exhausted).toBe(false);
            expect(this.bulwark.tokens.damage).toBe(undefined);
            expect(this.sequis.tokens.damage).toBe(undefined);
            expect(this.sergeantZakiel.tokens.damage).toBe(undefined);
            expect(this.bumpsy.tokens.damage).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
