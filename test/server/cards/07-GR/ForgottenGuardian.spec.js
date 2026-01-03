describe('Forgotten Guardian', function () {
    describe("Forgotten Guardian's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['forgotten-guardian'],
                    discard: ['dust-pixie', 'hunting-witch']
                },
                player2: {
                    hand: ['mind-barb'],
                    discard: ['poke', 'data-forge', 'cursed-relic']
                }
            });
            this.player1.chains = 36;
            this.player2.moveCard(this.cursedRelic, 'purged');
        });

        it('can purge own card on play', function () {
            this.player1.playCreature(this.forgottenGuardian);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.poke);
            expect(this.player1).toBeAbleToSelect(this.dataForge);
            this.player1.clickCard(this.huntingWitch);
            expect(this.huntingWitch.location).toBe('purged');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.poke.location).toBe('discard');
            expect(this.dataForge.location).toBe('discard');
        });

        it('can purge opponent card on play', function () {
            this.player1.playCreature(this.forgottenGuardian);
            expect(this.player1).toBeAbleToSelect(this.dustPixie);
            expect(this.player1).toBeAbleToSelect(this.huntingWitch);
            expect(this.player1).toBeAbleToSelect(this.poke);
            expect(this.player1).toBeAbleToSelect(this.dataForge);
            this.player1.clickCard(this.poke);
            expect(this.poke.location).toBe('purged');
            expect(this.dustPixie.location).toBe('discard');
            expect(this.huntingWitch.location).toBe('discard');
            expect(this.dataForge.location).toBe('discard');
        });

        it('can return a purged card on scrap', function () {
            expect(this.cursedRelic.location).toBe('purged');
            this.player1.scrap(this.forgottenGuardian);
            expect(this.player1).toBeAbleToSelect(this.cursedRelic);
            this.player1.clickCard(this.cursedRelic);
            this.expectReadyToTakeAction(this.player1);
            expect(this.cursedRelic.location).toBe('deck');
            expect(this.player2.player.deck).toContain(this.cursedRelic);
        });

        it('does not return a purged card when discarded by opponent', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.play(this.mindBarb);
            expect(this.forgottenGuardian.location).toBe('discard');
            this.player1.clickCard(this.forgottenGuardian);
            expect(this.cursedRelic.location).toBe('purged');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
