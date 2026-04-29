describe('Sneaky Feats', function () {
    describe("Sneaky Feats's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'shadows',
                    token: 'stooge',
                    hand: ['nerve-blast', 'sneaky-feats'],
                    inPlay: ['seeker-needle']
                },
                player2: {
                    amber: 2,
                    hand: ['information-exchange'],
                    discard: ['umbra-fiend']
                }
            });

            this.stooge1 = this.player1.player.deck[0];
        });

        it('should make a token on play', function () {
            this.player1.play(this.sneakyFeats);
            expect(this.stooge1.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not archive if no steals this turn', function () {
            this.player1.play(this.sneakyFeats);
            expect(this.sneakyFeats.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should archive if you stole this turn', function () {
            this.player1.play(this.nerveBlast);
            this.player1.play(this.sneakyFeats);
            expect(this.sneakyFeats.location).toBe('archives');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not archive if your opponent stole the previous turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.play(this.informationExchange);
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.play(this.sneakyFeats);
            expect(this.sneakyFeats.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not archive if only opponent stole this turn', function () {
            this.player2.moveCard(this.umbraFiend, 'play area');
            this.umbraFiend.damage = 1;
            this.player1.useAction(this.seekerNeedle);
            this.player1.clickCard(this.umbraFiend);
            this.player1.play(this.sneakyFeats);
            expect(this.sneakyFeats.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should not archive if you stole the previous turn', function () {
            this.player1.play(this.nerveBlast);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('shadows');
            this.player1.play(this.sneakyFeats);
            expect(this.sneakyFeats.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
