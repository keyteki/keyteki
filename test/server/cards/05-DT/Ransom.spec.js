describe('Ransom', function () {
    describe("Ransom's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    inPlay: ['sacro-thief'],
                    hand: ['ransom']
                },
                player2: {
                    amber: 1,
                    inPlay: ['collector-worm', 'eunoia', 'zorg']
                }
            });
        });

        describe('when played on own creature', function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.ransom, this.sacroThief);
            });

            it('should not be able to use the creature', function () {
                this.player1.clickCard(this.sacroThief);
                this.expectReadyToTakeAction(this.player1);
            });

            it('should not affect opponent', function () {
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
                this.player2.reap(this.collectorWorm);
            });

            describe('when not enough amber to pay ransom', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('untamed');
                    this.player2.endTurn();
                });

                it('should not be prompted to pay ransom', function () {
                    this.player1.clickPrompt('shadows');
                    this.player1.endTurn();
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(1);
                    expect(this.ransom.location).not.toBe('discard');
                });
            });

            describe('when player has enough amber to pay ransom', function () {
                beforeEach(function () {
                    this.player1.amber = 3;
                    this.player1.endTurn();
                    this.player2.clickPrompt('untamed');
                    this.player2.endTurn();
                });

                it('should be prompted to pay ransom', function () {
                    expect(this.player1).toBeAbleToSelect(this.sacroThief);
                    expect(this.player1).toHavePromptButton('Done');
                });

                describe('and do not pay ransom', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('Done');
                    });

                    it('should not be destroyed', function () {
                        this.player1.clickPrompt('shadows');
                        expect(this.player1.amber).toBe(3);
                        expect(this.player2.amber).toBe(1);
                        expect(this.ransom.location).not.toBe('discard');
                        this.player1.clickCard(this.sacroThief);
                        this.expectReadyToTakeAction(this.player1);
                        this.player1.endTurn();
                    });
                });

                describe('and pay ransom', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.sacroThief);
                    });

                    it('should be destroyed', function () {
                        this.player1.clickPrompt('shadows');
                        expect(this.player1.amber).toBe(1);
                        expect(this.player2.amber).toBe(3);
                        expect(this.ransom.location).toBe('discard');
                        expect(this.sacroThief.location).toBe('play area');
                        this.player1.reap(this.sacroThief);
                        this.player1.endTurn();
                    });
                });
            });
        });

        describe('when played on opponent creature', function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.ransom, this.collectorWorm);
            });

            describe('when not enough amber to pay ransom', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                });

                it('should not be prompted to pay ransom', function () {
                    this.player2.clickPrompt('untamed');
                    this.player2.endTurn();
                    expect(this.player1.amber).toBe(1);
                    expect(this.player2.amber).toBe(1);
                    expect(this.ransom.location).not.toBe('discard');
                });

                it('should not be able to use the creature', function () {
                    this.player2.clickPrompt('untamed');
                    this.player2.clickCard(this.collectorWorm);
                    this.expectReadyToTakeAction(this.player2);
                    this.player2.endTurn();
                });

                it('should not affect owner', function () {
                    this.player2.clickPrompt('untamed');
                    this.player2.endTurn();
                    this.player1.clickPrompt('shadows');
                    this.player1.reap(this.sacroThief);
                });
            });

            describe('when player has enough amber to pay ransom', function () {
                beforeEach(function () {
                    this.player2.amber = 5;
                    this.player1.endTurn();
                });

                it('should be prompted to pay ransom', function () {
                    expect(this.player2).toBeAbleToSelect(this.collectorWorm);
                    expect(this.player2).toHavePromptButton('Done');
                });

                describe('and do not pay ransom', function () {
                    beforeEach(function () {
                        this.player2.clickPrompt('Done');
                    });

                    it('should not be destroyed', function () {
                        this.player2.clickPrompt('mars');
                        expect(this.player1.amber).toBe(1);
                        expect(this.player2.amber).toBe(5);
                        expect(this.ransom.location).not.toBe('discard');
                        this.player2.clickCard(this.collectorWorm);
                        this.expectReadyToTakeAction(this.player2);
                        this.player2.endTurn();
                    });
                });

                describe('and pay ransom', function () {
                    beforeEach(function () {
                        this.player2.clickCard(this.collectorWorm);
                    });

                    it('should be destroyed', function () {
                        this.player2.clickPrompt('mars');
                        expect(this.player1.amber).toBe(3);
                        expect(this.player2.amber).toBe(3);
                        expect(this.ransom.location).toBe('discard');
                        expect(this.collectorWorm.location).toBe('play area');
                        this.player2.reap(this.collectorWorm);
                        this.player2.endTurn();
                    });
                });
            });
        });
    });
});
