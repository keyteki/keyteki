describe('Agent Sepdia', function () {
    describe("Agent Sepdia's reap effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    inPlay: ['agent-sepdia', 'censor-philo-evil-twin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['bramble-lynx', 'tantadlin', 'ancient-bear']
                }
            });
        });

        describe('when the tide is neutral', function () {
            beforeEach(function () {
                this.player1.reap(this.agentSepdia);
            });

            it('should deal 1D to a creature and not stun it', function () {
                expect(this.player1).toBeAbleToSelect(this.brambleLynx);
                expect(this.player1).toBeAbleToSelect(this.censorPhiloEvilTwin);
                expect(this.player1).toBeAbleToSelect(this.agentSepdia);
                expect(this.player1).toBeAbleToSelect(this.tantadlin);
                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                this.player1.clickCard(this.tantadlin);
                expect(this.tantadlin.damage).toBe(1);
                expect(this.tantadlin.stunned).toBe(false);
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
                this.player1.reap(this.agentSepdia);
            });

            it('should deal 1D to a creature and not stun it', function () {
                expect(this.player1).toBeAbleToSelect(this.brambleLynx);
                expect(this.player1).toBeAbleToSelect(this.censorPhiloEvilTwin);
                expect(this.player1).toBeAbleToSelect(this.agentSepdia);
                expect(this.player1).toBeAbleToSelect(this.tantadlin);
                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                this.player1.clickCard(this.tantadlin);
                expect(this.tantadlin.damage).toBe(1);
                expect(this.tantadlin.stunned).toBe(false);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                this.player1.reap(this.agentSepdia);
            });

            it('should deal 1D to a creature and stun it', function () {
                expect(this.player1).toBeAbleToSelect(this.brambleLynx);
                expect(this.player1).toBeAbleToSelect(this.censorPhiloEvilTwin);
                expect(this.player1).toBeAbleToSelect(this.agentSepdia);
                expect(this.player1).toBeAbleToSelect(this.tantadlin);
                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                this.player1.clickCard(this.tantadlin);
                expect(this.tantadlin.damage).toBe(1);
                expect(this.tantadlin.stunned).toBe(true);
            });
        });
    });

    describe("Agent Sepdia's fight effect", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    inPlay: ['agent-sepdia', 'censor-philo-evil-twin']
                },
                player2: {
                    amber: 4,
                    inPlay: ['bramble-lynx', 'tantadlin', 'ancient-bear']
                }
            });
        });

        describe('when the tide is neutral', function () {
            beforeEach(function () {
                this.player1.fightWith(this.agentSepdia, this.tantadlin);
            });

            it('should deal 1D to a creature and not stun it', function () {
                expect(this.player1).toBeAbleToSelect(this.brambleLynx);
                expect(this.player1).toBeAbleToSelect(this.censorPhiloEvilTwin);
                expect(this.player1).toBeAbleToSelect(this.agentSepdia);
                expect(this.player1).toBeAbleToSelect(this.tantadlin);
                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                this.player1.clickCard(this.tantadlin);
                expect(this.tantadlin.damage).toBe(5);
                expect(this.tantadlin.stunned).toBe(false);
            });
        });

        describe('when the tide is low', function () {
            beforeEach(function () {
                this.player1.lowerTide();
                this.player1.fightWith(this.agentSepdia, this.tantadlin);
            });

            it('should deal 1D to a creature and not stun it', function () {
                expect(this.player1).toBeAbleToSelect(this.brambleLynx);
                expect(this.player1).toBeAbleToSelect(this.censorPhiloEvilTwin);
                expect(this.player1).toBeAbleToSelect(this.agentSepdia);
                expect(this.player1).toBeAbleToSelect(this.tantadlin);
                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                this.player1.clickCard(this.tantadlin);
                expect(this.tantadlin.damage).toBe(5);
                expect(this.tantadlin.stunned).toBe(false);
            });
        });

        describe('when the tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
                this.player1.fightWith(this.agentSepdia, this.tantadlin);
            });

            it('should deal 1D to a creature and stun it', function () {
                expect(this.player1).toBeAbleToSelect(this.brambleLynx);
                expect(this.player1).toBeAbleToSelect(this.censorPhiloEvilTwin);
                expect(this.player1).toBeAbleToSelect(this.agentSepdia);
                expect(this.player1).toBeAbleToSelect(this.tantadlin);
                expect(this.player1).toBeAbleToSelect(this.ancientBear);
                this.player1.clickCard(this.tantadlin);
                expect(this.tantadlin.damage).toBe(5);
                expect(this.tantadlin.stunned).toBe(true);
            });
        });
    });
});
