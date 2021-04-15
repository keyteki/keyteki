describe('Call of the Void', function () {
    describe("Call of the Void's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 4,
                    house: 'unfathomable',
                    hand: ['call-of-the-void', 'rakuzel-s-chant', 'kaupe'],
                    inPlay: ['forgemaster-og', 'bingle-bangbang']
                },
                player2: {
                    amber: 4,
                    hand: ['exile'],
                    inPlay: ['nexus', 'urchin', 'dodger']
                }
            });
        });

        it('makes self lose 1 amber if destroy own exhausted creature', function () {
            this.player1.play(this.kaupe);
            this.player1.play(this.callOfTheVoid);
            this.player1.clickCard(this.kaupe);
            expect(this.kaupe.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            expect(this.player2.amber).toBe(4);
        });

        it('makes opponent lose 1 amber if destroy opponents exhausted creature', function () {
            this.player1.play(this.rakuzelSChant);
            this.player1.clickCard(this.nexus);
            this.player1.play(this.callOfTheVoid);
            this.player1.clickCard(this.nexus);
            expect(this.nexus.location).toBe('discard');
            expect(this.player1.amber).toBe(6);
            expect(this.player2.amber).toBe(3);
        });

        it('doesnt lose our amber if doesnt destroy our flank creature', function () {
            this.player1.play(this.callOfTheVoid);
            this.player1.clickCard(this.nexus);
            expect(this.nexus.location).toBe('play area');
            expect(this.nexus.exhausted).toBe(true);
            expect(this.player1.amber).toBe(5);
            expect(this.player2.amber).toBe(4);
        });
    });
});
