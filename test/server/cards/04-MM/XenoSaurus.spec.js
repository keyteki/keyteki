describe('Xeno-Saurus', function () {
    describe("Xeno-Saurus's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'saurian',
                    hand: ['xeno-saurus']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });

            this.player1.play(this.xenoSaurus);
        });

        it('should allow xeno-saurus to be exalted', function () {
            expect(this.player1).toHavePrompt('Any reactions to xeno-saurus being played?');
        });

        describe('and the ability is triggered', function () {
            beforeEach(function () {
                this.player1.clickCard(this.xenoSaurus);
            });

            it('should exalt xeno-saurus', function () {
                expect(this.xenoSaurus.tokens.amber).toBe(1);
            });

            describe('should prompt to to do damage', function () {
                it('damage troll', function () {
                    expect(this.player1).toHavePrompt('Choose a creature');
                    expect(this.player1).toBeAbleToSelect(this.troll);
                    expect(this.player1).toBeAbleToSelect(this.xenoSaurus);
                    this.player1.clickCard(this.troll);
                    expect(this.troll.tokens.damage).toBe(3);
                });
            });
        });

        describe('and the ability is not triggered', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Done');
            });

            it('should not exalt xeno-saurus', function () {
                expect(this.xenoSaurus.tokens.amber).toBe(undefined);
            });
        });
    });

    describe("Xeno-Saurus's Fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['xeno-saurus'],
                    hand: ['eyegor', 'titan-mechanic', 'archimedes'],
                    amber: 4
                },
                player2: {
                    amber: 1,
                    inPlay: ['lamindra', 'shooler', 'troll']
                }
            });

            this.player1.moveCard(this.eyegor, 'deck');
            this.player1.moveCard(this.titanMechanic, 'deck');
            this.player1.moveCard(this.archimedes, 'deck');
        });

        it('should not prompt for cards is deck is empty', function () {
            this.player1.player.deck = [];
            this.player1.fightWith(this.xenoSaurus, this.lamindra);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for a single card if deck has only 1 card', function () {
            this.player1.player.deck = [this.archimedes];
            this.player1.fightWith(this.xenoSaurus, this.lamindra);
            expect(this.player1).toHavePrompt('Choose a card to add to hand');
            expect(this.player1).toHavePromptCardButton(this.archimedes);
            this.player1.clickPrompt('archimedes');
            expect(this.archimedes.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prompt for a card to go to hand and one to bottom of deck', function () {
            this.player1.fightWith(this.xenoSaurus, this.lamindra);
            expect(this.player1).toHavePrompt('Choose a card to add to hand');
            expect(this.player1).toHavePromptCardButton(this.eyegor);
            expect(this.player1).toHavePromptCardButton(this.archimedes);
            expect(this.player1).toHavePromptCardButton(this.titanMechanic);
            this.player1.clickPrompt('archimedes');
            expect(this.archimedes.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to move to bottom of deck');
            expect(this.player1).toHavePromptCardButton(this.eyegor);
            expect(this.player1).toHavePromptCardButton(this.titanMechanic);
            this.player1.clickPrompt('eyegor');
            expect(this.player1.player.deck[0]).toBe(this.titanMechanic);
            expect(this.player1.player.deck[this.player1.player.deck.length - 1]).toBe(this.eyegor);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
