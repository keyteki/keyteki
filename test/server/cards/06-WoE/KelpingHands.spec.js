describe('KelpingHands', function () {
    describe('in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['bubbles'],
                    inPlay: ['flaxia', 'chelonia', 'kelping-hands']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        describe('before used,', function () {
            it('creatures should not have poison', function () {
                expect(this.flaxia.hasKeyword('poison')).toBe(false);
                expect(this.chelonia.hasKeyword('poison')).toBe(false);
            });

            it('creatures should not kill trolls', function () {
                this.player1.fightWith(this.chelonia, this.krump);
                expect(this.chelonia.location).toBe('discard');
                expect(this.krump.location).toBe('play area');
            });
        });

        describe('after omni used,', function () {
            beforeEach(function () {
                this.player1.useAction(this.kelpingHands, true);
            });

            it('Kelping Hands should be destroyed', function () {
                expect(this.kelpingHands.location).toBe('discard');
            });

            it('creatures should have poison', function () {
                expect(this.flaxia.hasKeyword('poison')).toBe(true);
                expect(this.chelonia.hasKeyword('poison')).toBe(true);
            });

            it('creatures should kill trolls', function () {
                this.player1.fightWith(this.chelonia, this.krump);
                expect(this.chelonia.location).toBe('discard');
                expect(this.krump.location).toBe('discard');
            });
        });
    });
});
