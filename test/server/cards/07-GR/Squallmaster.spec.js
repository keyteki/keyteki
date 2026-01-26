describe('Squallmaster', function () {
    describe("Squallmaster's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['squallmaster', 'crushing-deep'],
                    inPlay: ['ancient-bear', 'cpo-zytar']
                },
                player2: {
                    hand: ['clone-home'],
                    inPlay: ['mindwarper', 'zorg', 'medic-ingram', 'transporter-platform']
                }
            });
            this.player1.chains = 36;
            this.player2.chains = 36;
        });

        describe('when ready', function () {
            beforeEach(function () {
                this.player1.playCreature(this.squallmaster);
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
                this.player2.endTurn();
                this.player1.clickPrompt('unfathomable');
            });

            it('should prompt for discard order on reap', function () {
                this.player1.reap(this.squallmaster);
                expect(this.player1).toHavePrompt('Choose which player discards first');
                this.player1.clickPrompt('Me');
                expect(this.crushingDeep.location).toBe('discard');
                expect(this.cloneHome.location).toBe('discard');
            });

            it('should allow choosing opponent first on reap', function () {
                this.player1.reap(this.squallmaster);
                expect(this.player1).toHavePrompt('Choose which player discards first');
                this.player1.clickPrompt('Opponent');
                expect(this.crushingDeep.location).toBe('discard');
                expect(this.cloneHome.location).toBe('discard');
            });

            it('should prompt for discard order on fight', function () {
                this.player1.fightWith(this.squallmaster, this.mindwarper);
                expect(this.player1).toHavePrompt('Choose which player discards first');
                this.player1.clickPrompt('Me');
                expect(this.crushingDeep.location).toBe('discard');
                expect(this.cloneHome.location).toBe('discard');
            });
        });

        it('should exhaust an enemy creature on scrap', function () {
            this.player1.scrap(this.squallmaster);
            expect(this.player1).not.toBeAbleToSelect(this.ancientBear);
            expect(this.player1).not.toBeAbleToSelect(this.cpoZytar);
            expect(this.player1).toBeAbleToSelect(this.mindwarper);
            expect(this.player1).toBeAbleToSelect(this.zorg);
            expect(this.player1).toBeAbleToSelect(this.medicIngram);
            expect(this.player1).not.toBeAbleToSelect(this.transporterPlatform);
            expect(this.zorg.exhausted).toBe(false);
            this.player1.clickCard(this.zorg);
            expect(this.zorg.exhausted).toBe(true);
        });
    });
});
