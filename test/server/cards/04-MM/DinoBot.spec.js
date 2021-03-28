describe('Dino-Bot', function () {
    describe("Dino-Bots's Play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 5,
                    house: 'logos',
                    hand: ['dino-bot']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });

            this.player1.play(this.dinoBot);
        });

        it('should allow dino-bot to be exalted', function () {
            expect(this.player1).toHavePrompt('Any reactions to Dino-Bot being played?');
        });

        describe('and the ability is triggered', function () {
            beforeEach(function () {
                this.player1.clickCard(this.dinoBot);
            });

            it('should exalt dino-bot', function () {
                expect(this.dinoBot.tokens.amber).toBe(1);
            });

            describe('should prompt to to do damage', function () {
                it('damage troll', function () {
                    expect(this.player1).toHavePrompt('Choose a creature');
                    expect(this.player1).toBeAbleToSelect(this.troll);
                    expect(this.player1).toBeAbleToSelect(this.dinoBot);
                    this.player1.clickCard(this.troll);
                    expect(this.troll.tokens.damage).toBe(3);
                });
            });
        });

        describe('and the ability is not triggered', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Done');
            });

            it('should not exalt dino-bot', function () {
                expect(this.dinoBot.tokens.amber).toBe(undefined);
            });
        });
    });
    describe("Dino-Bots's Reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dino-bot', 'old-yurk'],
                    hand: ['soulkeeper']
                },
                player2: {
                    inPlay: ['nexus', 'troll', 'dodger']
                }
            });
        });

        it('should discard a card and draw a card when used to reap', function () {
            this.player1.reap(this.dinoBot);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Dino-Bot');
            expect(this.player1).toBeAbleToSelect(this.soulkeeper);
            this.player1.clickCard(this.soulkeeper);
            expect(this.soulkeeper.location).toBe('discard');
            expect(this.player1.hand.length).toBe(1);
        });

        it("should shouldn't draw a card when used to reap when there is nothing to discard", function () {
            this.player1.moveCard(this.soulkeeper, 'deck');
            this.player1.reap(this.dinoBot);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            this.player1.clickCard(this.soulkeeper);
            expect(this.soulkeeper.location).toBe('deck');
            expect(this.player1.hand.length).toBe(0);
        });
    });
});
