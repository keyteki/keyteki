describe('Stratosmack', function () {
    describe("Stratosmack' ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    token: 'grumpus',
                    inPlay: ['pelf', 'grumpus:groke'],
                    hand: ['stratosmack', 'exchange-program']
                },
                player2: {
                    inPlay: ['batdrone', 'troll']
                }
            });
        });

        it('should make a token when killing an enemy creature', function () {
            this.player1.play(this.stratosmack);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.grumpus);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.batdrone);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not make a token when not killing a creature', function () {
            this.player1.play(this.stratosmack);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.grumpus);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.troll);
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make a token when killing a friendly creature', function () {
            this.player1.play(this.stratosmack);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.grumpus);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not make a token when not killing a warded creature', function () {
            this.batdrone.tokens.ward = 1;
            this.player1.play(this.stratosmack);
            expect(this.player1).toBeAbleToSelect(this.pelf);
            expect(this.player1).toBeAbleToSelect(this.grumpus);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.batdrone);
            expect(this.player1.player.creaturesInPlay.length).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make a token when killing an exchanged token creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.play(this.exchangeProgram);
            this.player1.clickCard(this.grumpus);
            this.player1.clickCard(this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');

            this.player1.play(this.stratosmack);
            this.player1.clickCard(this.grumpus);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.grumpus.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should make a token when killing an exchanged creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('ekwidon');
            this.player1.play(this.exchangeProgram);
            this.player1.clickCard(this.pelf);
            this.player1.clickCard(this.troll);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('brobnar');

            this.player1.play(this.stratosmack);
            this.player1.clickCard(this.pelf);
            this.player1.clickPrompt('Right');
            expect(this.player1.player.creaturesInPlay.length).toBe(3);
            expect(this.pelf.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
