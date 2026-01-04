describe('Strange Torpedo', function () {
    describe("Strange Torpedo's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['strange-torpedo'],
                    inPlay: ['bubbles']
                },
                player2: {
                    inPlay: ['old-bruno', 'hunting-witch', 'flaxia', 'titan-guardian', 'umbra'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
        });

        it('should deal damage only when opponent is not haunted', function () {
            this.player1.play(this.strangeTorpedo);
            expect(this.player1).toBeAbleToSelect(this.oldBruno);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.flaxia);
            expect(this.player1).toBeAbleToSelect(this.titanGuardian);
            expect(this.player1).toBeAbleToSelect(this.umbra);
            expect(this.player1).toBeAbleToSelect(this.bubbles);
            this.player1.clickCard(this.huntingWitch);
            expect(this.oldBruno.tokens.damage).toBe(1);
            expect(this.oldBruno.stunned).toBe(false);
            expect(this.oldBruno.exhausted).toBe(false);
            expect(this.huntingWitch.tokens.damage).toBe(1);
            expect(this.huntingWitch.stunned).toBe(false);
            expect(this.huntingWitch.exhausted).toBe(false);
            expect(this.flaxia.tokens.damage).toBe(1);
            expect(this.flaxia.stunned).toBe(false);
            expect(this.flaxia.exhausted).toBe(false);
            expect(this.titanGuardian.tokens.damage).toBe(undefined);
            expect(this.umbra.tokens.damage).toBe(undefined);
            expect(this.bubbles.tokens.damage).toBe(undefined);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should deal damage, and stun and exhaust damaged creatures, when opponent is haunted', function () {
            this.player1.fightWith(this.bubbles, this.huntingWitch);
            this.player1.play(this.strangeTorpedo);
            this.player1.clickCard(this.titanGuardian);
            expect(this.flaxia.tokens.damage).toBe(1);
            expect(this.flaxia.stunned).toBe(true);
            expect(this.flaxia.exhausted).toBe(true);
            expect(this.titanGuardian.tokens.damage).toBe(undefined);
            expect(this.titanGuardian.stunned).toBe(false);
            expect(this.titanGuardian.exhausted).toBe(false);
            expect(this.umbra.tokens.damage).toBe(1);
            expect(this.umbra.stunned).toBe(true);
            expect(this.umbra.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
