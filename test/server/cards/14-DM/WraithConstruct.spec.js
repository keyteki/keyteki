describe('Wraith Construct', function () {
    describe("Wraith Construct's start of turn ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['wraith-construct'],
                    hand: ['troll', 'lamindra']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
        });

        it("triggers at the start of player's turn and discards a chosen card", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).toBeAbleToSelect(this.troll);
            expect(this.player1).toBeAbleToSelect(this.lamindra);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.lamindra.location).toBe('hand');
            this.player1.clickPrompt('geistoid');
            expect(this.player1).isReadyToTakeAction();
        });

        it("does not trigger on opponent's turn", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
            expect(this.troll.location).toBe('hand');
            expect(this.lamindra.location).toBe('hand');
        });
    });

    describe('Wraith Construct ordering with other start-of-turn effects', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['wraith-construct', 'novu-dynamo'],
                    hand: ['troll', 'eyegor']
                },
                player2: {
                    inPlay: ['bumpsy']
                }
            });
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
        });

        it('lets the player resolve Wraith Construct first then Novu Dynamo', function () {
            expect(this.player1).toBeAbleToSelect(this.wraithConstruct);
            expect(this.player1).toBeAbleToSelect(this.novuDynamo);

            this.player1.clickCard(this.wraithConstruct);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');

            this.player1.clickCard(this.eyegor);
            expect(this.eyegor.location).toBe('discard');
            expect(this.player1.amber).toBe(1);

            this.player1.clickPrompt('geistoid');
            expect(this.player1).isReadyToTakeAction();
        });

        it('lets the player resolve Novu Dynamo first then Wraith Construct', function () {
            expect(this.player1).toBeAbleToSelect(this.wraithConstruct);
            expect(this.player1).toBeAbleToSelect(this.novuDynamo);

            this.player1.clickCard(this.novuDynamo);
            this.player1.clickCard(this.eyegor);
            expect(this.eyegor.location).toBe('discard');
            expect(this.player1.amber).toBe(1);

            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');

            this.player1.clickPrompt('geistoid');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
