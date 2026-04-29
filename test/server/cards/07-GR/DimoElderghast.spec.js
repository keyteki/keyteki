describe('Dimo, Elderghast', function () {
    describe("Dimo, Elderghast's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'geistoid',
                    hand: ['replicative-growth'],
                    inPlay: ['echofly', 'dimo-elderghast'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    amber: 1,
                    inPlay: ['thing-from-the-deep', 'kelpminder', 'hunting-witch', 'dust-pixie'],
                    discard: new Array(9).fill('poke') // not yet haunted
                }
            });
            this.player1.chains = 36;
            this.echofly.amber = 2;
        });

        it('does nothing when not haunted', function () {
            this.player1.fightWith(this.echofly, this.thingFromTheDeep);
            expect(this.echofly.location).toBe('discard');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        describe('when haunted', function () {
            beforeEach(function () {
                this.player1.play(this.replicativeGrowth);
            });

            it('does nothing for friendly creatures with no amber when they are destroyed', function () {
                this.echofly.amber = 0;
                this.player1.fightWith(this.echofly, this.thingFromTheDeep);
                expect(this.echofly.location).toBe('discard');
                expect(this.player1.amber).toBe(2);
                expect(this.player1).isReadyToTakeAction();
            });

            it('gains amber for friendly creatures with amber when they are destroyed', function () {
                this.player1.fightWith(this.echofly, this.thingFromTheDeep);
                expect(this.echofly.location).toBe('discard');
                expect(this.player1.amber).toBe(4);
                expect(this.player1).isReadyToTakeAction();
            });

            it('does nothing for haunted enemy creatures when they are destroyed', function () {
                this.dustPixie.amber = 1;
                this.player1.fightWith(this.dimoElderghast, this.huntingWitch);
                this.player1.fightWith(this.echofly, this.dustPixie);
                expect(this.dustPixie.location).toBe('discard');
                expect(this.player1.amber).toBe(3);
                expect(this.player2.amber).toBe(1);
                expect(this.player1).isReadyToTakeAction();
            });

            it('works on the opponents turn as well', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('unfathomable');
                this.player2.fightWith(this.kelpminder, this.echofly);
                expect(this.echofly.location).toBe('discard');
                expect(this.player1.amber).toBe(4);
            });
        });
    });
});
