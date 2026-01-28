describe('TheFirstScroll', function () {
    describe('test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['helper-bot', 'titan-mechanic', 'bad-penny', 'the-first-scroll'],
                    amber: 12
                },
                player2: {
                    inPlay: ['snufflegator', 'halacor'],
                    amber: 9
                }
            });
        });

        describe('when opponent forged their creatures should capture', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.forgeKey('Red');
            });

            it('should capture 2 amber', function () {
                expect(this.player2.amber).toBe(1);
                expect(this.snufflegator.amber).toBe(1);
                expect(this.halacor.amber).toBe(1);

                expect(this.player1.amber).toBe(12);
                expect(this.helperBot.amber).toBe(0);
                expect(this.titanMechanic.amber).toBe(0);
                expect(this.badPenny.amber).toBe(0);
                expect(this.badPenny.amber).toBe(0);
            });

            describe('when player forged their creatures should capture', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('untamed');
                    this.player2.endTurn();
                    this.player1.forgeKey('Red');
                });

                it('should capture 3 amber', function () {
                    expect(this.player2.amber).toBe(1);
                    expect(this.snufflegator.amber).toBe(1);
                    expect(this.halacor.amber).toBe(1);

                    expect(this.player1.amber).toBe(3);
                    expect(this.helperBot.amber).toBe(1);
                    expect(this.titanMechanic.amber).toBe(1);
                    expect(this.badPenny.amber).toBe(1);
                    expect(this.badPenny.amber).toBe(1);
                });
            });

            describe('when player forged their creatures should capture', function () {
                beforeEach(function () {
                    this.player1.amber = 8;
                    this.player2.clickPrompt('untamed');
                    this.player2.endTurn();
                    this.player1.forgeKey('Red');
                });

                it('choose which creatures capture', function () {
                    expect(this.player1).toHavePrompt('Not enough amber, choose creatures');
                    expect(this.player1).toBeAbleToSelect(this.helperBot);
                    expect(this.player1).toBeAbleToSelect(this.titanMechanic);
                    expect(this.player1).toBeAbleToSelect(this.badPenny);
                    this.player1.clickCard(this.helperBot);
                    this.player1.clickCard(this.titanMechanic);
                    this.player1.clickPrompt('Done');
                    this.player1.clickPrompt('logos');

                    expect(this.player1.amber).toBe(0);
                    expect(this.helperBot.amber).toBe(1);
                    expect(this.titanMechanic.amber).toBe(1);
                    expect(this.badPenny.amber).toBe(0);
                    expect(this.player1).isReadyToTakeAction();
                });
            });
        });
    });

    describe('when Keyfrog is destroyed and forges a key', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'saurian',
                    inPlay: ['the-first-scroll', 'censor-philo'],
                    amber: 2
                },
                player2: {
                    inPlay: ['keyfrog', 'snufflegator'],
                    amber: 7
                }
            });
        });

        it('should make opponent creatures capture from opponent pool, not active player pool', function () {
            this.player1.fightWith(this.censorPhilo, this.keyfrog);
            this.player1.clickPrompt('Red');
            expect(this.keyfrog.location).toBe('play area');
            expect(this.player2.amber).toBe(1);
            expect(this.player1).toHavePrompt('Not enough amber, choose creatures');
            expect(this.player1).toBeAbleToSelect(this.keyfrog);
            expect(this.player1).toBeAbleToSelect(this.snufflegator);
            this.player1.clickCard(this.keyfrog);

            // Player1 started with 2, gained 1 when Keyfrog was destroyed (captured amber goes to opponent)
            expect(this.player1.amber).toBe(3);
            expect(this.player2.amber).toBe(0);
            expect(this.keyfrog.location).toBe('discard');
            expect(this.snufflegator.amber).toBe(0);
            expect(this.censorPhilo.amber).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
