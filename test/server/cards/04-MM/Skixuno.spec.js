describe('Skixuno', function () {
    describe("Skixuno's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['skixuno'],
                    inPlay: ['rotgrub', 'ember-imp']
                },
                player2: {
                    inPlay: ['bloodshard-imp']
                }
            });
        });

        it('should gain 1 power for each creature destroyed', function () {
            this.player1.play(this.skixuno);

            expect(this.skixuno.location).toBe('play area');
            expect(this.skixuno.tokens.power).toBe(3);

            expect(this.emberImp.location).toBe('discard');
            expect(this.rotgrub.location).toBe('discard');
            expect(this.bloodshardImp.location).toBe('discard');
        });

        xit('should not gain power for failing to destroy warded creatures', function () {
            this.rotgrub.tokens.ward = 1;
            this.player1.play(this.skixuno);

            expect(this.skixuno.location).toBe('play area');
            expect(this.skixuno.tokens.power).toBe(2);

            expect(this.rotgrub.location).toBe('play area');
            expect(this.emberImp.location).toBe('discard');
            expect(this.bloodshardImp.location).toBe('discard');
        });

        it('should end the turn', function () {
            this.player1.play(this.skixuno);
            expect(this.player2).toHavePrompt('House Choice');
        });
    });
});
