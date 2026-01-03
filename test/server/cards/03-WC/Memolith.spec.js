describe('Memolith', function () {
    describe("Memolith's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['memolith'],
                    hand: ['troll', 'autocannon']
                },
                player2: {
                    inPlay: ['panpaca-anga', 'flaxia', 'tantadlin', 'bigtwig']
                }
            });
        });

        it('should do nothing when there is no action in the hand or grafted card', function () {
            this.player1.useAction(this.memolith);
            expect(this.player1).not.toHavePrompt('Memolith');
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            expect(this.player1).not.toBeAbleToSelect(this.autocannon);
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe("Memolith's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['memolith'],
                    hand: ['pound', 'anger', 'autocannon', 'infomancer']
                },
                player2: {
                    inPlay: ['panpaca-anga', 'flaxia', 'tantadlin', 'bigtwig']
                }
            });
        });

        it('should allow grafting an action card', function () {
            this.player1.useAction(this.memolith);
            expect(this.player1).toHavePrompt('Memolith');
            expect(this.player1).toBeAbleToSelect(this.pound);
            expect(this.player1).toBeAbleToSelect(this.anger);
            expect(this.player1).not.toBeAbleToSelect(this.infomancer);
            expect(this.player1).not.toBeAbleToSelect(this.autocannon);
            this.player1.clickCard(this.pound);
            expect(this.pound.game.isCardVisible(this.pound, this.player1.player)).toBe(true);
            expect(this.pound.game.isCardVisible(this.pound, this.player2.player)).toBe(true);
            expect(this.pound.parent).toBe(this.memolith);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should activate the play effect of a grafted card', function () {
            this.player1.useAction(this.memolith);
            this.player1.clickCard(this.pound);
            expect(this.pound.parent).toBe(this.memolith);
            this.memolith.exhausted = false;
            this.player1.useAction(this.memolith);
            expect(this.player1).toHavePrompt('Memolith');
            expect(this.player1).toBeAbleToSelect(this.pound);
            expect(this.player1).toBeAbleToSelect(this.anger);
            this.player1.clickCard(this.pound);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.tantadlin);
            expect(this.tantadlin.tokens.damage).toBe(2);
            expect(this.bigtwig.tokens.damage).toBe(1);
            expect(this.flaxia.tokens.damage).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should activate the play effect of a grafted card, if no action to attach', function () {
            this.player1.moveCard(this.anger, 'discard');
            this.player1.useAction(this.memolith);
            this.player1.clickCard(this.pound);
            expect(this.pound.parent).toBe(this.memolith);
            this.memolith.exhausted = false;
            this.player1.useAction(this.memolith);
            expect(this.player1).toHavePrompt('Memolith');
            this.player1.clickCard(this.pound);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.tantadlin);
            expect(this.tantadlin.tokens.damage).toBe(2);
            expect(this.bigtwig.tokens.damage).toBe(1);
            expect(this.flaxia.tokens.damage).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should activate the play effect of a grafted card on Memolith only', function () {
            this.player1.play(this.infomancer);
            this.player1.clickCard(this.anger);
            this.player1.useAction(this.memolith);
            this.player1.clickCard(this.pound);
            expect(this.pound.parent).toBe(this.memolith);
            this.memolith.exhausted = false;
            this.player1.useAction(this.memolith);
            expect(this.player1).toHavePrompt('Memolith');
            expect(this.player1).toBeAbleToSelect(this.pound);
            expect(this.player1).not.toBeAbleToSelect(this.anger);
            this.player1.clickCard(this.pound);
            expect(this.player1).toHavePrompt('Choose a creature');
            this.player1.clickCard(this.tantadlin);
            expect(this.tantadlin.tokens.damage).toBe(2);
            expect(this.bigtwig.tokens.damage).toBe(1);
            expect(this.flaxia.tokens.damage).toBe(1);
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe("Memolith's and Remote Access ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['remote-access', 'wild-wormhole', 'labwork', 'dextre']
                },
                player2: {
                    inPlay: ['memolith', 'troll'],
                    hand: ['anger', 'pound']
                }
            });
        });

        it('should allow grafting an action card', function () {
            this.player1.play(this.remoteAccess);
            this.player1.clickCard(this.memolith);
            expect(this.player1).toBeAbleToSelect(this.wildWormhole);
            expect(this.player1).toBeAbleToSelect(this.labwork);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).not.toBeAbleToSelect(this.pound);
            expect(this.player1).not.toBeAbleToSelect(this.anger);
            this.player1.clickCard(this.labwork);
            expect(this.labwork.parent).toBe(this.memolith);
            this.expectReadyToTakeAction(this.player1);
        });

        it("should allow using opponent's grafted card", function () {
            this.player1.play(this.remoteAccess);
            this.player1.clickCard(this.memolith);
            this.player1.clickCard(this.labwork);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.memolith.exhausted = false;
            this.player2.useAction(this.memolith);
            expect(this.player2).not.toBeAbleToSelect(this.wildWormhole);
            expect(this.player2).toBeAbleToSelect(this.labwork);
            expect(this.player2).not.toBeAbleToSelect(this.dextre);
            expect(this.player2).toBeAbleToSelect(this.pound);
            expect(this.player2).toBeAbleToSelect(this.anger);
            this.player2.clickCard(this.pound);
            expect(this.labwork.game.isCardVisible(this.labwork, this.player1.player)).toBe(true);
            expect(this.labwork.game.isCardVisible(this.labwork, this.player2.player)).toBe(true);
            expect(this.pound.game.isCardVisible(this.pound, this.player1.player)).toBe(true);
            expect(this.pound.game.isCardVisible(this.pound, this.player2.player)).toBe(true);
            expect(this.labwork.parent).toBe(this.memolith);
            expect(this.pound.parent).toBe(this.memolith);
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.moveCard(this.remoteAccess, 'hand');
            this.player1.play(this.remoteAccess);
            this.player1.clickCard(this.memolith);
            expect(this.player1).toBeAbleToSelect(this.wildWormhole);
            expect(this.player1).toBeAbleToSelect(this.labwork);
            expect(this.player1).not.toBeAbleToSelect(this.dextre);
            expect(this.player1).toBeAbleToSelect(this.pound);
            expect(this.player1).not.toBeAbleToSelect(this.anger);
            this.player1.clickCard(this.pound);
            this.player1.clickCard(this.troll);
            expect(this.troll.tokens.damage).toBe(2);
            this.expectReadyToTakeAction(this.player1);
        });
    });
});
