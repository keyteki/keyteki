describe('Gargantodon', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'saurian',
                    inPlay: ['eyegor', 'rustgnawer'],
                    hand: ['gargantodon']
                },
                player2: {
                    amber: 4,
                    hand: ['urchin', 'magda-the-rat'],
                    inPlay: ['dextre', 'troll']
                }
            });

            this.player1.play(this.gargantodon);
        });

        it('should enter play stunned', function () {
            expect(this.gargantodon.stunned).toBe(true);
        });
    });

    describe('when fighting', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'saurian',
                    inPlay: ['gargantodon', 'rustgnawer']
                },
                player2: {
                    amber: 4,
                    hand: ['urchin', 'magda-the-rat'],
                    inPlay: ['dextre', 'troll']
                }
            });
        });

        it('should only deal 4 damage', function () {
            this.player1.fightWith(this.gargantodon, this.troll);
            expect(this.troll.tokens.damage).toBe(4);
        });
    });

    describe("on opponent's turn", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'saurian',
                    inPlay: ['gargantodon', 'rustgnawer']
                },
                player2: {
                    amber: 4,
                    hand: ['urchin', 'magda-the-rat'],
                    inPlay: ['dextre', 'troll']
                }
            });

            this.player1.endTurn();
        });

        describe('when an amber is stolen', function () {
            beforeEach(function () {
                this.player2.clickPrompt('shadows');
                this.player2.play(this.urchin);
            });

            it('should prompt for a creature to capture instead', function () {
                expect(this.player2).toBeAbleToSelect(this.troll);
                expect(this.player2).not.toBeAbleToSelect(this.gargantodon);
            });

            describe('and a creature it selected', function () {
                beforeEach(function () {
                    this.player2.clickCard(this.troll);
                });

                it('should capture amber on the selected creature', function () {
                    expect(this.troll.tokens.amber).toBe(1);
                });

                it('should stop amber being stolen', function () {
                    expect(this.player1.amber).toBe(2);
                    expect(this.player2.amber).toBe(4);
                });
            });
        });

        describe('when more than one amber is stolen', function () {
            beforeEach(function () {
                this.player2.clickPrompt('shadows');
                this.player2.play(this.magdaTheRat);
                this.player2.clickCard(this.troll);
            });

            it('should capture amber on the selected creature', function () {
                expect(this.troll.tokens.amber).toBe(2);
            });

            it('should stop amber being stolen', function () {
                expect(this.player1.amber).toBe(1);
                expect(this.player2.amber).toBe(4);
            });
        });
    });

    describe("on controller's turn", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'logos',
                    hand: ['information-exchange', 'cutthroat-research'],
                    inPlay: ['gargantodon', 'rustgnawer']
                },
                player2: {
                    amber: 8,
                    hand: ['urchin', 'magda-the-rat'],
                    inPlay: ['dextre', 'troll']
                }
            });
        });

        describe('when an amber is stolen', function () {
            beforeEach(function () {
                this.player1.play(this.informationExchange);
            });

            it('should prompt for a creature to capture instead', function () {
                expect(this.player1).toBeAbleToSelect(this.gargantodon);
                expect(this.player1).not.toBeAbleToSelect(this.dextre);
            });

            describe('and a creature it selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.gargantodon);
                });

                it('should capture amber on the selected creature', function () {
                    expect(this.gargantodon.tokens.amber).toBe(1);
                });

                it('should stop amber being stolen', function () {
                    expect(this.player1.amber).toBe(3);
                    expect(this.player2.amber).toBe(7);
                });
            });
        });

        describe('when more than one amber is stolen', function () {
            beforeEach(function () {
                this.player1.play(this.cutthroatResearch);
                this.player1.clickCard(this.rustgnawer);
            });

            it('should capture amber on the selected creature', function () {
                expect(this.rustgnawer.tokens.amber).toBe(2);
            });

            it('should stop amber being stolen', function () {
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(6);
            });
        });

        describe('when opponent steal amber', function () {
            beforeEach(function () {
                this.player2.amber = 3;

                this.player1.endTurn();
                this.player2.clickPrompt('shadows');
                this.player2.play(this.urchin);
                this.player2.clickCard(this.dextre);
                this.player2.endTurn();
            });

            it('should not count as steal for future actions', function () {
                this.player1.clickPrompt('logos');
                this.player1.play(this.informationExchange);
                this.player1.clickCard(this.gargantodon);
                expect(this.gargantodon.tokens.amber).toBe(1);
            });
        });
    });

    describe("on controller's turn", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 3,
                    house: 'shadows',
                    hand: ['life-for-a-life'],
                    inPlay: ['dodger']
                },
                player2: {
                    amber: 3,
                    hand: ['urchin', 'magda-the-rat'],
                    inPlay: ['gargantodon', 'brend-the-fanatic']
                }
            });
        });

        describe("when opponent's steal", function () {
            beforeEach(function () {
                this.player1.fightWith(this.dodger, this.brendTheFanatic);
            });

            it('should prompt for a creature to capture own amber', function () {
                expect(this.player1).toBeAbleToSelect(this.dodger);
                expect(this.player1).not.toBeAbleToSelect(this.gargantodon);
            });

            describe('and a creature it selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.dodger);
                });

                it('should capture amber on the selected creature', function () {
                    expect(this.dodger.tokens.amber).toBe(3);
                });

                it('should stop own amber being stolen', function () {
                    expect(this.player1.amber).toBe(0);
                    expect(this.player2.amber).toBe(3);
                });
            });
        });

        describe("when opponent's steal and there is no creature in play", function () {
            beforeEach(function () {
                this.player1.play(this.lifeForALife);
                this.player1.clickCard(this.dodger);
                this.player1.clickCard(this.brendTheFanatic);
            });

            it('should stop own amber being stolen', function () {
                expect(this.player1.amber).toBe(4);
                expect(this.player2.amber).toBe(3);
            });
        });
    });
});
