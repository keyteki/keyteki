describe('Hida Amoro', function() {
    integration(function() {
        describe('Hida Amoro\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['miya-mystic']
                    },
                    player2: {
                        inPlay: ['hida-amoro', 'kaiu-envoy'],
                        hand: ['fine-katana']
                    }
                });
                this.hidaAmoro = this.player2.findCardByName('hida-amoro');
                this.kaiuEnvoy = this.player2.findCardByName('kaiu-envoy');
            });

            it('should trigger when the opponent passes', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                expect(this.player1).toHavePrompt('Hida Amoro');
                expect(this.player1).toBeAbleToSelect('miya-mystic');
                expect(this.player1).not.toBeAbleToSelect(this.hidaAmoro);
                expect(this.player1).not.toBeAbleToSelect(this.kaiuEnvoy);
                this.miyaMystic = this.player1.clickCard('miya-mystic');
                expect(this.miyaMystic.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should trigger when it\'s controller passes', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
                this.miyaMystic = this.player1.clickCard('miya-mystic');
                this.noMoreActions();
                this.player2.clickPrompt('Pass Conflict');
                this.player2.clickPrompt('Yes');
                expect(this.player2).toHavePrompt('Hida Amoro');
                expect(this.player2).toBeAbleToSelect(this.hidaAmoro);
                expect(this.player2).toBeAbleToSelect(this.kaiuEnvoy);
                this.player2.clickCard(this.kaiuEnvoy);
                expect(this.kaiuEnvoy.location).toBe('dynasty discard pile');
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should not trigger when the opponent has no characters to sacrifice', function() {
                this.player1.pass();
                this.fineKatana = this.player2.playAttachment('fine-katana', this.hidaAmoro);
                this.miyaMystic = this.player1.clickCard('miya-mystic');
                expect(this.player1).toHavePrompt('Miya Mystic');
                this.player1.clickCard(this.fineKatana);
                expect(this.miyaMystic.location).toBe('dynasty discard pile');
                expect(this.fineKatana.location).toBe('conflict discard pile');
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Action Window');
            });
        });
    });
});
