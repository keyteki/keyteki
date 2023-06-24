describe('Primordial Vault', function () {
    describe("Primordial Vault's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    token: 'cultist',
                    hand: ['tangaika'],
                    inPlay: [
                        'primordial-vault',
                        'cultist:pelf',
                        'cultist:troll',
                        'cultist:bumpsy',
                        'cultist:groke',
                        'cultist:press-gang',
                        'vulka'
                    ]
                },
                player2: {
                    inPlay: ['kelifi-dragon', 'batdrone']
                }
            });

            this.token1 = this.player1.player.creaturesInPlay[0];
            this.token2 = this.player1.player.creaturesInPlay[1];
            this.token3 = this.player1.player.creaturesInPlay[2];
            this.token4 = this.player1.player.creaturesInPlay[3];
            this.token5 = this.player1.player.creaturesInPlay[4];
        });

        it('should destroy 4 cultists to search for Tangiaka', function () {
            this.player1.moveCard(this.tangaika, 'deck');
            this.player1.useAction(this.primordialVault);
            expect(this.player1).toBeAbleToSelect(this.token1);
            expect(this.player1).toBeAbleToSelect(this.token2);
            expect(this.player1).toBeAbleToSelect(this.token3);
            expect(this.player1).toBeAbleToSelect(this.token4);
            expect(this.player1).toBeAbleToSelect(this.token5);
            expect(this.player1).not.toBeAbleToSelect(this.vulka);
            this.player1.clickCard(this.token1);
            this.player1.clickCard(this.token2);
            this.player1.clickCard(this.token3);
            this.player1.clickCard(this.token4);
            this.player1.clickPrompt('Done');
            expect(this.token1.location).toBe('discard');
            expect(this.token2.location).toBe('discard');
            expect(this.token3.location).toBe('discard');
            expect(this.token4.location).toBe('discard');
            expect(this.token5.location).toBe('play area');
            expect(this.vulka.location).toBe('play area');
            this.player1.clickCard(this.tangaika);
            this.player1.clickPrompt('Done');
            expect(this.tangaika.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should destroy 4 cultists to search for Tangiaka in discard', function () {
            this.player1.moveCard(this.tangaika, 'discard');
            this.player1.useAction(this.primordialVault);
            this.player1.clickCard(this.token1);
            this.player1.clickCard(this.token2);
            this.player1.clickCard(this.token3);
            this.player1.clickCard(this.token4);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.tangaika);
            this.player1.clickPrompt('Done');
            expect(this.tangaika.location).toBe('hand');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not search if you do not have enough Cultists (but still destroy all cultists)', function () {
            this.player1.fightWith(this.token1, this.kelifiDragon);
            this.player1.fightWith(this.token2, this.kelifiDragon);
            this.player1.useAction(this.primordialVault);
            this.player1.clickCard(this.token3);
            this.player1.clickCard(this.token4);
            this.player1.clickCard(this.token5);
            this.player1.clickPrompt('Done');
            expect(this.token3.location).toBe('discard');
            expect(this.token4.location).toBe('discard');
            expect(this.token5.location).toBe('discard');
            expect(this.vulka.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not search if a cultist was warded', function () {
            this.token1.tokens.ward = 1;
            this.player1.useAction(this.primordialVault);
            this.player1.clickCard(this.token1);
            this.player1.clickCard(this.token2);
            this.player1.clickCard(this.token3);
            this.player1.clickCard(this.token4);
            this.player1.clickPrompt('Done');
            expect(this.token1.location).toBe('play area');
            expect(this.token2.location).toBe('discard');
            expect(this.token3.location).toBe('discard');
            expect(this.token4.location).toBe('discard');
            expect(this.token5.location).toBe('play area');
            expect(this.vulka.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should make a cultist at the start of your turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('unfathomable');
            expect(this.player1.player.creaturesInPlay.length).toBe(7);
            expect(this.player1.player.creaturesInPlay[6].name).toBe('Cultist');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
