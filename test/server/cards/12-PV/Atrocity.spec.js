describe('Atrocity', function () {
    describe("Atrocity's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['atrocity']
                },
                player2: {
                    amber: 4,
                    discard: ['ancient-bear', 'ember-imp', 'krump']
                }
            });
        });

        it('should discard top card and force house choice on next turn', function () {
            this.player2.moveCard(this.ancientBear, 'deck');
            this.player1.playCreature(this.atrocity);
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).not.toHavePromptButton('dis');
            expect(this.player2).not.toHavePromptButton('brobnar');
            this.player2.clickPrompt('untamed');
            expect(this.ancientBear.location).toBe('discard');
            expect(this.atrocity.damage).toBe(0);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should not restrict house if opponent has no deck', function () {
            this.player2.player.deck = [];
            this.player1.playCreature(this.atrocity);
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('brobnar');
            expect(this.atrocity.damage).toBe(0);
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should only trigger once (on the next turn)', function () {
            this.player2.moveCard(this.ancientBear, 'deck');
            this.player1.playCreature(this.atrocity);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            expect(this.ancientBear.location).toBe('discard');
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            this.player1.endTurn();
            expect(this.player2).toHavePromptButton('untamed');
            expect(this.player2).toHavePromptButton('dis');
            expect(this.player2).toHavePromptButton('brobnar');
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('Atrocity played via Be Our Geist', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['be-our-geist']
                },
                player2: {
                    discard: new Array(9).fill('poke').concat(['atrocity', 'ancient-bear'])
                }
            });
        });

        it('should discard from the correct deck when played by opponent', function () {
            this.player2.moveCard(this.ancientBear, 'deck');
            this.player1.play(this.beOurGeist);
            this.player1.clickCard(this.atrocity);
            expect(this.atrocity.location).toBe('play area');
            expect(this.player1.player.creaturesInPlay).toContain(this.atrocity);
            this.player1.endTurn();
            expect(this.ancientBear.location).toBe('discard');
            expect(this.player2).toHavePromptButton('untamed');
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
