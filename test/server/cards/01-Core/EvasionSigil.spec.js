describe('Evasion Sigil', function () {
    describe("Evasion Sigil's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dextre', 'batdrone'],
                    discard: ['troll']
                },
                player2: {
                    inPlay: ['evasion-sigil', 'sequis']
                }
            });

            this.player1.moveCard(this.troll, 'deck');
        });

        it("should allow creatures to attack when the top card is a different house, and stop them when it's the same", function () {
            this.player1.fightWith(this.dextre, this.sequis);
            expect(this.troll.location).toBe('discard');
            expect(this.dextre.location).toBe('deck');
            expect(this.sequis.tokens.damage).toBe(1);
            this.player1.fightWith(this.batdrone, this.sequis);
            expect(this.dextre.location).toBe('discard');
            expect(this.batdrone.location).toBe('play area');
            expect(this.batdrone.exhausted).toBe(true);
            expect(this.sequis.tokens.damage).toBe(1);
        });
    });
});
