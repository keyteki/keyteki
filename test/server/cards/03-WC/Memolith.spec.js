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
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
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
            expect(this.pound.facedown).toBe(false);
            expect(this.pound.parent).toBe(this.memolith);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should activate the play effect of a grafted card', function () {
            this.player1.useAction(this.memolith);
            this.player1.clickCard(this.pound);
            expect(this.pound.facedown).toBe(false);
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
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should activate the play effect of a grafted card, if no action to attach', function () {
            this.player1.moveCard(this.anger, 'discard');
            this.player1.useAction(this.memolith);
            this.player1.clickCard(this.pound);
            expect(this.pound.facedown).toBe(false);
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
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should activate the play effect of a grafted card on Memolith only', function () {
            this.player1.play(this.infomancer);
            this.player1.clickCard(this.anger);
            this.player1.useAction(this.memolith);
            this.player1.clickCard(this.pound);
            expect(this.pound.facedown).toBe(false);
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
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
