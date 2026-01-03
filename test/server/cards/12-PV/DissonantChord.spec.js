describe('Dissonant Chord', function () {
    describe("Dissonant Chord's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'sanctum',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['dissonant-chord'],
                    inPlay: ['yurk']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia', 'ember-imp', 'troll']
                }
            });
        });

        it('should stun neighbors when destroying a creature', function () {
            this.player1.play(this.dissonantChord);
            this.player1.clickCard(this.emberImp);
            expect(this.emberImp.location).toBe('discard');
            expect(this.troll.stunned).toBe(true);
            expect(this.flaxia.stunned).toBe(true);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should not stun neighbors when not destroying a creature', function () {
            this.player1.play(this.dissonantChord);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.tokens.damage).toBe(3);
            expect(this.emberImp.stunned).toBe(false);
            expect(this.flaxia.stunned).toBe(false);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should stun friendly creatures with amber when fate is triggered', function () {
            this.emberImp.tokens.amber = 2;
            this.yurk.tokens.amber = 1;
            this.player1.activateProphecy(this.overreach, this.dissonantChord);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            expect(this.emberImp.stunned).toBe(true);
            expect(this.yurk.stunned).toBe(false);
            expect(this.troll.stunned).toBe(false);
            expect(this.flaxia.stunned).toBe(false);
            expect(this.dissonantChord.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
