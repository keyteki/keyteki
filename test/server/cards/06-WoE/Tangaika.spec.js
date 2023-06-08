describe('Tangaika', function () {
    describe("Tangaika's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
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

        it('should be playable with at least 4 cultists', function () {
            this.player1.playCreature(this.tangaika);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not be playable without 4 cultists', function () {
            this.player1.fightWith(this.token1, this.kelifiDragon);
            this.player1.fightWith(this.token2, this.kelifiDragon);
            this.player1.clickCard(this.tangaika);
            expect(this.player1).not.toHavePromptButton('Play this creature');
        });

        it('should gain an amber on fighting', function () {
            this.player1.playCreature(this.tangaika);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('unfathomable');
            expect(this.player1.amber).toBe(3);

            this.player1.fightWith(this.tangaika, this.batdrone);
            expect(this.player1.amber).toBe(4);
            expect(this.kelifiDragon.tokens.damage).toBe(5);
        });
    });
});
