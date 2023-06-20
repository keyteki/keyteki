describe('Extrematode Infection', function () {
    describe("Extrematode Infection's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 4,
                    token: 'grumpus',
                    inPlay: ['earthshaker', 'brammo'],
                    hand: ['seabringer-kekoa', 'initiation', 'ged-hammer', 'extrematode-infection']
                },
                player2: {
                    amber: 3,
                    inPlay: ['batdrone', 'mother'],
                    discard: ['helper-bot', 'archimedes', 'eureka']
                }
            });

            this.player1.playUpgrade(this.extrematodeInfection, this.earthshaker);
        });

        it('should put 3 hatch counters on it', function () {
            expect(this.extrematodeInfection.tokens.hatch).toBe(3);
        });

        describe('remove after first turn', function () {
            beforeEach(function () {
                this.player1.endTurn();
                this.player2.clickPrompt('logos');
                this.player2.endTurn();
                this.player1.clickPrompt('unfathomable');
            });

            it('should have 2 hatch counters on it', function () {
                expect(this.extrematodeInfection.tokens.hatch).toBe(2);
            });

            describe('remove one more after second turn', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('logos');
                    this.player2.endTurn();
                    this.player1.clickPrompt('unfathomable');
                });

                it('should have 2 hatch counters on it', function () {
                    expect(this.extrematodeInfection.tokens.hatch).toBe(1);
                });

                describe('remove last one after third turn', function () {
                    beforeEach(function () {
                        this.player1.endTurn();

                        this.player1.moveCard(this.seabringerKekoa, 'deck');
                        this.player1.moveCard(this.initiation, 'deck');
                        this.player1.moveCard(this.gedHammer, 'deck');

                        this.player2.clickPrompt('logos');
                        this.player2.endTurn();
                    });

                    it('should destroy the creature and make 3 token creatures', function () {
                        this.player1.clickPrompt('Right');
                        this.player1.clickPrompt('Right');
                        this.player1.clickPrompt('Right');
                        this.player1.clickPrompt('unfathomable');

                        expect(this.extrematodeInfection.location).toBe('discard');
                        expect(this.earthshaker.location).toBe('discard');
                        expect(this.seabringerKekoa.location).toBe('play area');
                        expect(this.seabringerKekoa.name).toBe('Grumpus');
                        expect(this.gedHammer.location).toBe('play area');
                        expect(this.gedHammer.name).toBe('Grumpus');
                        expect(this.initiation.location).toBe('play area');
                        expect(this.initiation.name).toBe('Grumpus');
                    });
                });
            });
        });
    });
});
