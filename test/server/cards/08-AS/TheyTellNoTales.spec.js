describe('They Tell No Tales', function () {
    describe("They Tell No Tales's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'dis',
                    hand: ['they-tell-no-tales'],
                    inPlay: ['ancient-bear', 'shooler']
                },
                player2: {
                    inPlay: ['troll', 'charette', 'krump']
                }
            });
        });

        it('should destroy all creatures of a chosen house', function () {
            this.player1.play(this.theyTellNoTales);
            expect(this.player1).toHavePrompt('They Tell No Tales');
            expect(this.player1).toHavePromptButton('brobnar');
            expect(this.player1).toHavePromptButton('dis');
            expect(this.player1).toHavePromptButton('logos');
            expect(this.player1).toHavePromptButton('mars');
            expect(this.player1).toHavePromptButton('sanctum');
            expect(this.player1).toHavePromptButton('shadows');
            expect(this.player1).toHavePromptButton('untamed');
            expect(this.player1).toHavePromptButton('staralliance');
            expect(this.player1).toHavePromptButton('saurian');
            expect(this.player1).toHavePromptButton('ekwidon');
            expect(this.player1).toHavePromptButton('geistoid');
            expect(this.player1).toHavePromptButton('skyborn');
            this.player1.clickPrompt('brobnar');
            expect(this.ancientBear.location).toBe('play area');
            expect(this.shooler.location).toBe('play area');
            expect(this.charette.location).toBe('play area');
            expect(this.troll.location).toBe('discard');
            expect(this.krump.location).toBe('discard');
            expect(this.player1.player.chains).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
