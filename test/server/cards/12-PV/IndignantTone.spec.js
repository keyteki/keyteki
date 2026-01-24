describe('Indignant Tone', function () {
    describe("Indignant Tone's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'redemption',
                    hand: ['indignant-tone'],
                    inPlay: ['ember-imp', 'yurk', 'flaxia']
                },
                player2: {
                    inPlay: ['searine', 'dust-pixie', 'cephaloist']
                }
            });
        });

        it('should deal 3 damage to a creature and enrage neighbors if destroyed', function () {
            this.player1.play(this.indignantTone);
            expect(this.player1).toBeAbleToSelect(this.emberImp);
            expect(this.player1).toBeAbleToSelect(this.yurk);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.searine);
            expect(this.player1).toBeAbleToSelect(this.cephaloist);
            this.player1.clickCard(this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.searine.enraged).toBe(true);
            expect(this.cephaloist.enraged).toBe(true);
            expect(this.yurk.enraged).toBe(false);
            expect(this.flaxia.enraged).toBe(false);
            expect(this.emberImp.enraged).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not enrage neighbors if creature is not destroyed', function () {
            this.player1.play(this.indignantTone);
            this.player1.clickCard(this.searine);
            expect(this.searine.tokens.damage).toBe(3);
            expect(this.searine.location).toBe('play area');
            expect(this.dustPixie.enraged).toBe(false);
            expect(this.cephaloist.enraged).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
