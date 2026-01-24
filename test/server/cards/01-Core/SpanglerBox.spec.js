describe('Spangler Box', function () {
    describe("Spangler Box's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: [
                        'doc-bookton',
                        'dextre',
                        'lamindra',
                        'batdrone',
                        'timetraveller',
                        'dysania'
                    ],
                    hand: ['spangler-box', 'remote-access']
                },
                player2: {
                    amber: 1,
                    inPlay: [
                        'silvertooth',
                        'gorm-of-omm',
                        'stealer-of-souls',
                        'annihilation-ritual',
                        'dust-imp',
                        'gub',
                        'charette'
                    ]
                }
            });

            this.player1.play(this.spanglerBox);
            this.spanglerBox.ready();
        });

        it('should purge a creature and transfer control', function () {
            this.player1.useAction(this.spanglerBox);
            expect(this.player1).toHavePrompt('Spangler Box');
            expect(this.player1).toBeAbleToSelect(this.docBookton);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.stealerOfSouls);
            this.player1.clickCard(this.silvertooth);
            expect(this.silvertooth.location).toBe('purged');
            expect(this.spanglerBox.purgedCards).toContain(this.silvertooth);
            expect(this.spanglerBox.controller).toBe(this.player2.player);
            expect(this.player2.player.cardsInPlay).toContain(this.spanglerBox);
            expect(this.spanglerBox.exhausted).toBe(true);
        });

        it('should not purge warded creatures and remain under owner control', function () {
            this.silvertooth.tokens.ward = 1;
            this.player1.useAction(this.spanglerBox);
            expect(this.player1).toHavePrompt('Spangler Box');
            expect(this.player1).toBeAbleToSelect(this.docBookton);
            expect(this.player1).toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.stealerOfSouls);
            this.player1.clickCard(this.silvertooth);
            expect(this.silvertooth.location).toBe('play area');
            expect(this.silvertooth.warded).toBe(false);
            expect(this.spanglerBox.controller).toBe(this.player1.player);
            expect(this.player1.player.cardsInPlay).toContain(this.spanglerBox);
            expect(this.spanglerBox.exhausted).toBe(true);
        });

        it('should allow opponent to choose logos, and use it', function () {
            this.player1.useAction(this.spanglerBox);
            this.player1.clickCard(this.silvertooth);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.spanglerBox.ready();
            this.player2.useAction(this.spanglerBox);
            expect(this.player2).toBeAbleToSelect(this.docBookton);
            expect(this.player2).not.toBeAbleToSelect(this.silvertooth);
            this.player2.clickCard(this.docBookton);
            expect(this.docBookton.location).toBe('purged');
            expect(this.spanglerBox.controller).toBe(this.player1.player);
            expect(this.player1.player.cardsInPlay).toContain(this.spanglerBox);
            expect(this.spanglerBox.exhausted).toBe(true);
        });

        it("should remain under opponent's control even if used by me", function () {
            this.player1.useAction(this.spanglerBox);
            this.player1.clickCard(this.silvertooth);
            this.spanglerBox.ready();
            this.player1.play(this.remoteAccess);
            expect(this.player1).toHavePrompt('Remote Access');
            expect(this.player1).toBeAbleToSelect(this.spanglerBox);
            expect(this.player1).toBeAbleToSelect(this.gormOfOmm);
            this.player1.clickCard(this.spanglerBox);
            expect(this.player1).toHavePrompt('Spangler Box');
            expect(this.player1).toBeAbleToSelect(this.docBookton);
            expect(this.player1).not.toBeAbleToSelect(this.silvertooth);
            expect(this.player1).toBeAbleToSelect(this.stealerOfSouls);
            this.player1.clickCard(this.stealerOfSouls);
            expect(this.stealerOfSouls.location).toBe('purged');
            expect(this.spanglerBox.controller).toBe(this.player2.player);
            expect(this.player2.player.cardsInPlay).toContain(this.spanglerBox);
            expect(this.spanglerBox.exhausted).toBe(true);
        });

        it('should return purged creatures to play, but not other purged cards', function () {
            this.player1.fightWith(this.docBookton, this.stealerOfSouls);
            expect(this.docBookton.location).toBe('purged');
            this.player1.useAction(this.spanglerBox);
            this.player1.clickCard(this.silvertooth);
            this.spanglerBox.ready();
            this.player1.play(this.remoteAccess);
            this.player1.clickCard(this.spanglerBox);
            this.player1.clickCard(this.stealerOfSouls);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.spanglerBox.ready();
            this.player2.useAction(this.spanglerBox);
            this.player2.clickCard(this.lamindra);
            expect(this.silvertooth.location).toBe('purged');
            expect(this.stealerOfSouls.location).toBe('purged');
            expect(this.lamindra.location).toBe('purged');
            this.player2.useOmni(this.gormOfOmm);
            this.player2.clickCard(this.spanglerBox);
            expect(this.spanglerBox.location).toBe('discard');

            // Start putting into play
            expect(this.player2).toBeAbleToSelect(this.silvertooth);
            expect(this.player2).toBeAbleToSelect(this.stealerOfSouls);
            expect(this.player2).toBeAbleToSelect(this.lamindra);
            expect(this.player2).not.toBeAbleToSelect(this.docBookton);

            this.player2.clickCard(this.stealerOfSouls);

            expect(this.player2).toHavePrompt('Stealer of Souls');
            this.player2.clickPrompt('Left');
            expect(this.stealerOfSouls.location).toBe('play area');
            expect(this.player2.player.cardsInPlay).toContain(this.stealerOfSouls);
            expect(this.stealerOfSouls.exhausted).toBe(true);
            expect(this.stealerOfSouls.hasToken('damage')).toBe(false);

            expect(this.player2).toBeAbleToSelect(this.silvertooth);
            expect(this.player2).not.toBeAbleToSelect(this.stealerOfSouls);
            expect(this.player2).toBeAbleToSelect(this.lamindra);
            expect(this.player2).not.toBeAbleToSelect(this.docBookton);

            this.player2.clickCard(this.silvertooth);
            expect(this.player2).toHavePrompt('Silvertooth');
            this.player2.clickPrompt('Left');
            expect(this.silvertooth.location).toBe('play area');
            expect(this.player2.player.cardsInPlay).toContain(this.silvertooth);
            expect(this.silvertooth.exhausted).toBe(false);

            expect(this.player2).toHavePrompt('Lamindra');
            expect(this.player2).toHavePromptButton('Left');
            expect(this.player2).toHavePromptButton('Right');
            expect(this.player2).toHavePromptButton('Deploy Left');
            expect(this.player2).toHavePromptButton('Deploy Right');
            this.player2.clickPrompt('Deploy Right');
            this.player2.clickCard(this.dextre);
            expect(this.lamindra.location).toBe('play area');
            expect(this.player1.player.cardsInPlay).toContain(this.lamindra);
            expect(this.lamindra.hasToken('amber')).toBe(false);
            expect(this.lamindra.exhausted).toBe(true);
            expect(this.docBookton.location).toBe('purged');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
