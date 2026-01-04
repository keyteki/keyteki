describe('Imperial Road', function () {
    describe("Imperial Road's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['imperial-road'],
                    hand: ['flaxia', 'tantadlin', 'troll']
                },
                player2: {
                    amber: 1
                }
            });
        });

        it('should not prompt for creature', function () {
            this.player1.useAction(this.imperialRoad, true);
            expect(this.player1).not.toHavePrompt('Choose a creature');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Imperial Road's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['imperial-road'],
                    hand: ['flaxia', 'tantadlin', 'troll', 'grimlocus-dux', 'tribune-pompitus']
                },
                player2: {
                    amber: 1,
                    inPlay: ['krump']
                }
            });
        });

        it("should be able to select Saurian creature to play and fizzle when there's none", function () {
            this.player1.useAction(this.imperialRoad, true);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.grimlocusDux);
            expect(this.player1).toBeAbleToSelect(this.tribunePompitus);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.tantadlin);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.grimlocusDux);
            expect(this.grimlocusDux.location).toBe('play area');
            expect(this.grimlocusDux.stunned).toBe(true);
            expect(this.player1).isReadyToTakeAction();
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.useAction(this.imperialRoad, true);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).not.toBeAbleToSelect(this.grimlocusDux);
            expect(this.player1).toBeAbleToSelect(this.tribunePompitus);
            this.player1.clickCard(this.tribunePompitus);
            this.player1.clickPrompt('left');
            expect(this.tribunePompitus.location).toBe('play area');
            expect(this.tribunePompitus.stunned).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.useAction(this.imperialRoad, true);
            expect(this.player1).not.toHavePrompt('Choose a creature');
            expect(this.player1).isReadyToTakeAction();
            expect(this.imperialRoad.exhausted).toBe(true);
        });
    });

    describe("Imperial Road's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['imperial-road'],
                    hand: ['bestiarii-urso', 'tribune-pompitus']
                },
                player2: {
                    amber: 1,
                    inPlay: ['krump']
                }
            });
        });

        it('should be able to unstun creatures that enter play stunned', function () {
            this.player1.useAction(this.imperialRoad, true);
            this.player1.clickCard(this.bestiariiUrso);
            expect(this.bestiariiUrso.location).toBe('play area');
            expect(this.bestiariiUrso.stunned).toBe(true);
            expect(this.player1).toHavePrompt('Choose a creature');
            expect(this.player1).toBeAbleToSelect(this.bestiariiUrso);
            this.player1.clickCard(this.bestiariiUrso);
            expect(this.bestiariiUrso.stunned).toBe(false);
        });
    });
});
