describe('Fading Apparition', function () {
    describe("Fading Apparition's amber redirect on reap", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['fading-apparition', 'boiler', 'jahneerie']
                },
                player2: {
                    inPlay: ['troll']
                }
            });
        });

        it('prompts to redirect when a friendly creature reaps while Fading Apparition is exhausted', function () {
            this.fadingApparition.exhaust();
            this.boiler.amber = 2;
            this.player1.reap(this.jahneerie);
            expect(this.player1).toBeAbleToSelect(this.boiler);
            expect(this.player1).not.toBeAbleToSelect(this.troll);
            this.player1.clickCard(this.boiler);
            expect(this.boiler.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can decline the redirect and keep the amber from the common supply', function () {
            this.fadingApparition.exhaust();
            this.boiler.amber = 2;
            this.player1.reap(this.jahneerie);
            this.player1.clickPrompt('Done');
            expect(this.boiler.amber).toBe(2);
            expect(this.jahneerie.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('triggers when Fading Apparition itself reaps because it is exhausted at reap resolution time', function () {
            this.boiler.amber = 1;
            this.player1.reap(this.fadingApparition);
            this.player1.clickCard(this.boiler);
            expect(this.boiler.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('allows targeting Fading Apparition itself if it has amber', function () {
            this.fadingApparition.exhaust();
            this.fadingApparition.amber = 1;
            this.player1.reap(this.jahneerie);
            expect(this.player1).toBeAbleToSelect(this.fadingApparition);
            this.player1.clickCard(this.fadingApparition);
            expect(this.fadingApparition.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not trigger when Fading Apparition is ready', function () {
            this.boiler.amber = 1;
            this.player1.reap(this.jahneerie);
            expect(this.boiler.amber).toBe(1);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not trigger when no friendly creature has amber', function () {
            this.fadingApparition.exhaust();
            this.player1.reap(this.jahneerie);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('replaces the reap gain (transfers amber from creature to player) rather than removing it after', function () {
            this.fadingApparition.exhaust();
            this.boiler.amber = 1;
            this.player1.reap(this.jahneerie);
            this.player1.clickCard(this.boiler);
            const logs = this.getChatLogs(20);
            expect(logs).toContain(
                'player1 uses Fading Apparition to take 1 amber from Boiler instead of the common supply'
            );
            // The standard reap-gain message should not appear because the gain handler was replaced.
            expect(logs.some((log) => log.includes('gains 1A'))).toBe(false);
            expect(this.boiler.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('prompts before the reap event resolves so chosen amber is moved before after-reap reactions fire', function () {
            // Construct a scenario: the chosen creature is also an after-reap trigger source.
            // The replacement must happen first so the amber is already moved when the
            // after-reap window opens. With the old reaction-based implementation, ordering
            // could be exploited to destroy/move the source creature before its amber was
            // taken, double-dipping.
            this.fadingApparition.exhaust();
            this.boiler.amber = 1;
            this.player1.reap(this.jahneerie);
            // At the prompt time, the reap's gain handler has not yet executed.
            expect(this.player1.amber).toBe(0);
            expect(this.boiler.amber).toBe(1);
            expect(this.player1).toHavePrompt('Fading Apparition');
            this.player1.clickCard(this.boiler);
            // After clicking, the replacement runs and the reap event resolves with the
            // replaced handler. The boiler's amber is now on the player and any subsequent
            // after-reap reactions would observe boiler.amber === 0.
            expect(this.boiler.amber).toBe(0);
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe("Fading Apparition's reaction does not trigger on enemy reaps", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    inPlay: ['fading-apparition', 'boiler']
                },
                player2: {
                    house: 'brobnar',
                    inPlay: ['troll']
                }
            });
        });

        it('does nothing when an enemy creature reaps while Fading Apparition is exhausted', function () {
            this.fadingApparition.exhaust();
            this.boiler.amber = 2;
            this.player1.endTurn();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.troll);
            expect(this.boiler.amber).toBe(2);
            expect(this.player2.amber).toBe(1);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
