describe('Helper Bot', function () {
    describe("Helper Bot's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['helper-bot', 'virtuous-works', 'wild-wormhole', 'punch']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
            this.player1.playCreature(this.helperBot);
        });

        it('should allow playing a non-logos card', function () {
            expect(this.player1.amber).toBe(0);
            this.player1.clickCard(this.virtuousWorks);
            this.player1.clickPrompt('Play this action');
            expect(this.player1.amber).toBe(3);
            this.player1.clickCard(this.punch);
            this.expectReadyToTakeAction(this.player1);
        });

        it('should stack', function () {
            this.player1.moveCard(this.helperBot, 'hand');
            this.player1.playCreature(this.helperBot);
            expect(this.player1.amber).toBe(0);
            this.player1.clickCard(this.virtuousWorks);
            this.player1.clickPrompt('Play this action');
            expect(this.player1.amber).toBe(3);
            this.player1.play(this.punch);
            expect(this.player1).toHavePrompt('Punch');
        });

        it('should not carry over to the following turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('logos');
            this.player1.clickCard(this.virtuousWorks);
            this.expectReadyToTakeAction(this.player1);
            expect(this.player1.amber).toBe(0);
        });

        it('should not be used up by Wild Wormhole', function () {
            this.player1.moveCard(this.virtuousWorks, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.virtuousWorks.location).toBe('discard');
            expect(this.player1.amber).toBe(4);
            this.player1.play(this.punch);
            expect(this.player1).toHavePrompt('Punch');
        });
    });

    describe("Helper Bot's ability in a non-Logos turn", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: [
                        'exhume',
                        'shooler',
                        'armsmaster-molina',
                        'soulkeeper',
                        'light-of-the-archons'
                    ],
                    discard: ['helper-bot']
                }
            });
        });

        it('should be used up by playing a non-Logos card of the active house', function () {
            this.player1.play(this.exhume);
            this.player1.clickCard(this.helperBot);
            this.player1.play(this.shooler);
            expect(this.player1).not.toBeAbleToPlay(this.armsmasterMolina);
        });
    });
});
