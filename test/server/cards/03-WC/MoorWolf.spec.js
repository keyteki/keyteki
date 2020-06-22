describe('Moor Wolf', function () {
    describe("Moor Wolf's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['mighty-tiger', 'dextre', 'moor-wolf'],
                    hand: ['moor-wolf', 'nocturnal-maneuver']
                },
                player2: {
                    inPlay: ['moor-wolf']
                }
            });
        });
        it('should ready all other wolf creatures when played', function () {
            this.moorWolf2 = this.player1.findCardByName('moor-wolf', 'hand');
            this.moorWolf3 = this.player2.findCardByName('moor-wolf', 'play area');
            this.player1.reap(this.moorWolf);
            expect(this.player1.amber).toBe(1);
            expect(this.moorWolf.exhausted).toBe(true);
            this.player1.play(this.nocturnalManeuver);
            this.player1.clickCard(this.moorWolf3);
            this.player1.clickPrompt('Done');
            this.player1.play(this.moorWolf2);
            expect(this.moorWolf.exhausted).toBe(false);
            expect(this.moorWolf2.exhausted).toBe(true);
            expect(this.moorWolf3.exhausted).toBe(false);
        });
    });
});
