describe('Dimo, Elderghast', function () {
    describe("Dimo, Elderghast's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    inPlay: ['echofly', 'dimo-elderghast']
                },
                player2: {
                    amber: 1,
                    inPlay: ['thing-from-the-deep', 'dust-pixie']
                }
            });
        });

        it('does nothing for friendly creatures with no amber when they are destroyed', function () {
            this.player1.fightWith(this.echofly, this.thingFromTheDeep);
            expect(this.echofly.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('gains amber for friendly creatures with amber when they are destroyed', function () {
            this.echofly.amber = 2;
            this.player1.fightWith(this.echofly, this.thingFromTheDeep);
            expect(this.echofly.location).toBe('discard');
            expect(this.player1.amber).toBe(3);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('does nothing for enemy creatures when they are destroyed', function () {
            this.dustPixie.amber = 1;
            this.player1.fightWith(this.echofly, this.dustPixie);
            expect(this.dustPixie.location).toBe('discard');
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
