describe('Corrode', function () {
    describe('when no card in play is affected by Corrode', function () {
        it('should not prompt', function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['corrode']
                },
                player2: {
                    inPlay: ['abyssal-zealot']
                }
            });
            this.player1.play(this.corrode);
            this.expectReadyToTakeAction(this.player1);
        });
    });

    describe('when a card in play is affected by Corrode', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    hand: ['corrode']
                },
                player2: {
                    inPlay: ['agent-sepdia', 'almsmaster']
                }
            });
            this.player1.play(this.corrode);
        });

        it('should prompt the options', function () {
            expect(this.player1).toHavePromptButton('Destroy an artifact');
            expect(this.player1).toHavePromptButton('Destroy an upgrade');
            expect(this.player1).toHavePromptButton('Destroy a creature with armor');
        });

        it('does not force you to destroy something', function () {
            this.player1.clickPrompt('Destroy an artifact');
            this.expectReadyToTakeAction(this.player1);
            expect(this.agentSepdia.location).toBe('play area');
            expect(this.almsmaster.location).toBe('play area');
        });

        it('destroys only one card if multiple qualify for the chosen mode', function () {
            this.player1.clickPrompt('Destroy a creature with armor');
            this.player1.clickCard(this.agentSepdia);
            expect(this.agentSepdia.location).toBe('discard');
            expect(this.almsmaster.location).toBe('play area');
        });
    });

    describe('choosing targets', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['corrode', 'way-of-the-wolf'],
                    inPlay: ['flaxia', 'ritual-of-balance']
                },
                player2: {
                    amber: 1,
                    inPlay: ['francus', 'krump', 'lifeward', 'soulkeeper']
                }
            });
            this.player1.playUpgrade(this.wayOfTheWolf, this.flaxia);
            this.player1.endTurn();
            this.player2.clickPrompt('dis');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player1.play(this.corrode);
        });

        describe('choosing an artifact', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Destroy an artifact');
            });
            it('lets you choose any artifact', function () {
                expect(this.player1).toBeAbleToSelect(this.lifeward);
                expect(this.player1).toBeAbleToSelect(this.ritualOfBalance);
            });
            it('destroys the chosen artifact', function () {
                this.player1.clickCard(this.lifeward);
                expect(this.lifeward.location).toBe('discard');
                expect(this.ritualOfBalance.location).toBe('play area');
                expect(this.flaxia.location).toBe('play area');
                expect(this.francus.location).toBe('play area');
                expect(this.krump.location).toBe('play area');
                expect(this.wayOfTheWolf.location).toBe('play area');
                expect(this.soulkeeper.location).toBe('play area');
            });
        });

        describe('choosing an upgrade', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Destroy an upgrade');
            });
            it('lets you choose any upgrade', function () {
                expect(this.player1).toBeAbleToSelect(this.wayOfTheWolf);
                expect(this.player1).toBeAbleToSelect(this.soulkeeper);
            });
            it('destroys the chosen upgrade', function () {
                this.player1.clickCard(this.wayOfTheWolf);
                expect(this.lifeward.location).toBe('play area');
                expect(this.ritualOfBalance.location).toBe('play area');
                expect(this.flaxia.location).toBe('play area');
                expect(this.francus.location).toBe('play area');
                expect(this.krump.location).toBe('play area');
                expect(this.wayOfTheWolf.location).toBe('discard');
                expect(this.soulkeeper.location).toBe('play area');
            });
        });

        describe('choosing an armored creature', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Destroy a creature with armor');
            });
            it('lets you choose any armored creature', function () {
                expect(this.player1).toBeAbleToSelect(this.francus);
                expect(this.player1).not.toBeAbleToSelect(this.krump);
            });
            it('destroys the chosen creature', function () {
                this.player1.clickCard(this.francus);
                expect(this.lifeward.location).toBe('play area');
                expect(this.ritualOfBalance.location).toBe('play area');
                expect(this.flaxia.location).toBe('play area');
                expect(this.francus.location).toBe('discard');
                expect(this.krump.location).toBe('play area');
                expect(this.wayOfTheWolf.location).toBe('play area');
                expect(this.soulkeeper.location).toBe('play area');
            });
        });
    });

    describe('when only upgrade is in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    amber: 1,
                    hand: ['corrode'],
                    inPlay: ['flaxia']
                },
                player2: {
                    amber: 1,
                    hand: ['pentacorder'],
                    inPlay: ['krump']
                }
            });
            this.player1.endTurn();
            this.player2.clickPrompt('staralliance');
            this.player2.playUpgrade(this.pentacorder, this.krump);
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            this.player1.play(this.corrode);
        });

        it('destroys the chosen upgrade', function () {
            expect(this.player1).toHavePromptButton('Destroy an upgrade');
            this.player1.clickPrompt('Destroy an upgrade');
            expect(this.player1).toBeAbleToSelect(this.pentacorder);
            this.player1.clickCard(this.pentacorder);
            expect(this.flaxia.location).toBe('play area');
            expect(this.krump.location).toBe('play area');

            this.expectReadyToTakeAction(this.player1);
            expect(this.pentacorder.location).toBe('discard');
        });
    });
});
