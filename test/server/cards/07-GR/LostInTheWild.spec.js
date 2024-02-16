describe('Lost in the Wild', function () {
    describe("Lost in the Wild's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['lost-in-the-wild', 'fertility-chant'],
                    inPlay: ['hunting-witch', 'flaxia', 'fandangle', 'dust-pixie', 'chelonia'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['dextre', 'roxador', 'francis-the-economist']
                }
            });
        });

        it('shuffles just flank creatures into deck when not haunted', function () {
            this.player1.play(this.lostInTheWild);
            expect(this.huntingWitch.location).toBe('deck');
            expect(this.chelonia.location).toBe('deck');
            expect(this.flaxia.location).toBe('play area');
            expect(this.dustPixie.location).toBe('play area');
            expect(this.fandangle.location).toBe('play area');
            expect(this.dextre.location).toBe('deck');
            expect(this.francisTheEconomist.location).toBe('deck');
            expect(this.roxador.location).toBe('play area');
        });

        it('shuffles flank creatures twice into deck when haunted', function () {
            this.player1.play(this.fertilityChant);
            this.player1.play(this.lostInTheWild);
            expect(this.huntingWitch.location).toBe('deck');
            expect(this.chelonia.location).toBe('deck');
            expect(this.flaxia.location).toBe('deck');
            expect(this.dustPixie.location).toBe('deck');
            expect(this.fandangle.location).toBe('play area');
            expect(this.dextre.location).toBe('deck');
            expect(this.francisTheEconomist.location).toBe('deck');
            expect(this.roxador.location).toBe('deck');
        });
    });
});
