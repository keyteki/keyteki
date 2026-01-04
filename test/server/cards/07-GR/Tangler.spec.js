describe('Tangler', function () {
    describe("Tangler's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['tangler'],
                    inPlay: ['miss-chievous']
                },
                player2: {
                    inPlay: ['mother', 'old-egad', 'faust-the-great', 'dust-pixie']
                }
            });
        });

        describe('on reap', function () {
            beforeEach(function () {
                this.player1.playCreature(this.tangler);
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.endTurn();
                this.player1.clickPrompt('geistoid');
                this.player1.reap(this.tangler);
            });

            it('can stun an enemy creature and its neighbors', function () {
                expect(this.player1).toBeAbleToSelect(this.mother);
                expect(this.player1).toBeAbleToSelect(this.oldEgad);
                expect(this.player1).toBeAbleToSelect(this.faustTheGreat);
                expect(this.player1).toBeAbleToSelect(this.dustPixie);
                expect(this.player1).toBeAbleToSelect(this.missChievous);
                expect(this.player1).toBeAbleToSelect(this.tangler);
                this.player1.clickCard(this.oldEgad);
                expect(this.mother.stunned).toBe(true);
                expect(this.oldEgad.stunned).toBe(true);
                expect(this.faustTheGreat.stunned).toBe(true);
                expect(this.dustPixie.stunned).toBe(false);
                expect(this.missChievous.stunned).toBe(false);
                expect(this.tangler.stunned).toBe(false);
                expect(this.player1).isReadyToTakeAction();
            });

            it('can stun a friendly creature and its neighbors', function () {
                this.player1.clickCard(this.missChievous);
                expect(this.mother.stunned).toBe(false);
                expect(this.oldEgad.stunned).toBe(false);
                expect(this.faustTheGreat.stunned).toBe(false);
                expect(this.dustPixie.stunned).toBe(false);
                expect(this.missChievous.stunned).toBe(true);
                expect(this.tangler.stunned).toBe(true);
                expect(this.player1).isReadyToTakeAction();
            });
        });

        it('can stun a creature on scrap', function () {
            this.player1.scrap(this.tangler);
            expect(this.player1).toBeAbleToSelect(this.mother);
            expect(this.player1).toBeAbleToSelect(this.oldEgad);
            expect(this.player1).toBeAbleToSelect(this.faustTheGreat);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.missChievous);
            this.player1.clickCard(this.oldEgad);
            expect(this.mother.stunned).toBe(false);
            expect(this.oldEgad.stunned).toBe(true);
            expect(this.faustTheGreat.stunned).toBe(false);
            expect(this.dustPixie.stunned).toBe(false);
            expect(this.missChievous.stunned).toBe(false);
            expect(this.tangler.stunned).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
