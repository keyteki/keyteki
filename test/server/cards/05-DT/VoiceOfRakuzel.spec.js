describe('Voice of Rakuzel', function () {
    describe("Voice of Rakuzel's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    inPlay: ['voice-of-rakuzel']
                },
                player2: {
                    inPlay: ['narp'],
                    discard: []
                }
            });
        });

        it('has no effect when the tide is neutral', function () {
            expect(this.voiceOfRakuzel.power).toBe(5);
            expect(this.voiceOfRakuzel.armor).toBe(1);
            expect(this.narp.power).toBe(8);
            expect(this.narp.armor).toBe(1);
        });

        it('raises friendly power and armor when the tide is high', function () {
            this.player1.raiseTide();
            expect(this.voiceOfRakuzel.power).toBe(6);
            expect(this.voiceOfRakuzel.armor).toBe(2);
            expect(this.narp.power).toBe(8);
            expect(this.narp.armor).toBe(1);
        });

        it('raises enemy power and armor when the tide is low', function () {
            this.player1.lowerTide();
            expect(this.voiceOfRakuzel.power).toBe(5);
            expect(this.voiceOfRakuzel.armor).toBe(1);
            expect(this.narp.power).toBe(9);
            expect(this.narp.armor).toBe(2);
        });
    });
});
