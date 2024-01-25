describe('Nameless Horror', function () {
    describe("Nameless Horror's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    hand: ['clone-home'],
                    inPlay: ['nameless-horror', 'tunk'],
                    discard: new Array(9).fill('poke') // not yet haunted
                },
                player2: {
                    inPlay: ['troll', 'groggins']
                }
            });
            this.player1.chains = 36;
        });

        it('should not give skirmish when not haunted', function () {
            this.player1.fightWith(this.namelessHorror, this.troll);
            expect(this.namelessHorror.location).toBe('discard');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should give skirmish when haunted', function () {
            this.player1.play(this.cloneHome);
            this.player1.fightWith(this.namelessHorror, this.troll);
            expect(this.namelessHorror.location).toBe('play area');
            expect(this.namelessHorror.tokens.damage).toBeUndefined();
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        describe('elusive is', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('brobnar');
            });

            it('not given when not haunted', function () {
                this.player2.fightWith(this.troll, this.namelessHorror);
                expect(this.namelessHorror.location).toBe('discard');
                expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            });

            it('given when haunted', function () {
                this.player2.fightWith(this.groggins, this.tunk);
                this.player2.fightWith(this.troll, this.namelessHorror);
                expect(this.namelessHorror.location).toBe('play area');
                expect(this.namelessHorror.tokens.damage).toBeUndefined();
                expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            });
        });
    });
});
