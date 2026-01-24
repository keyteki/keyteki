describe("Dead Man's Chest", function () {
    describe("Dead Man's Chest's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    hand: ['dead-man-s-chest'],
                    inPlay: ['murkens', 'bad-penny', 'dodger']
                },
                player2: {
                    amber: 1,
                    inPlay: ['bumblebird', 'piranha-monkeys', 'fuzzy-gruen']
                }
            });

            this.player1.play(this.deadManSChest);
        });

        it('should be able to select a creature to damage', function () {
            expect(this.player1).toBeAbleToSelect(this.murkens);
            expect(this.player1).toBeAbleToSelect(this.badPenny);
            expect(this.player1).toBeAbleToSelect(this.dodger);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.piranhaMonkeys);
            expect(this.player1).toBeAbleToSelect(this.fuzzyGruen);
            expect(this.player1).not.toBeAbleToSelect(this.deadManSChest);
        });

        describe('and a card is selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.fuzzyGruen);
            });

            it('should deal 2D', function () {
                expect(this.fuzzyGruen.damage).toBe(2);
                expect(this.deadManSChest.amber).toBe(4);
            });

            describe('when controller destroys 6 creatures, but it is not ready', function () {
                beforeEach(function () {
                    this.player1.fightWith(this.badPenny, this.bumblebird);
                    this.player1.fightWith(this.murkens, this.piranhaMonkeys);
                    this.player1.fightWith(this.dodger, this.fuzzyGruen);
                });

                it('should not gain the 4A', function () {
                    expect(this.badPenny.location).toBe('hand');
                    expect(this.murkens.location).toBe('discard');
                    expect(this.dodger.location).toBe('discard');
                    expect(this.bumblebird.location).toBe('discard');
                    expect(this.piranhaMonkeys.location).toBe('discard');
                    expect(this.fuzzyGruen.location).toBe('discard');
                    expect(this.player1.amber).toBe(2);
                    expect(this.player2.amber).toBe(1);
                    this.player1.endTurn();
                });
            });

            describe('when opponent destroys 6 creatures, but it is not ready', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('untamed');
                    this.deadManSChest.exhaust();
                    this.player2.fightWith(this.bumblebird, this.badPenny);
                    this.player2.fightWith(this.piranhaMonkeys, this.murkens);
                    this.player2.fightWith(this.fuzzyGruen, this.dodger);
                });

                it('should not gain the 4A', function () {
                    expect(this.badPenny.location).toBe('hand');
                    expect(this.murkens.location).toBe('discard');
                    expect(this.dodger.location).toBe('discard');
                    expect(this.bumblebird.location).toBe('discard');
                    expect(this.piranhaMonkeys.location).toBe('discard');
                    expect(this.fuzzyGruen.location).toBe('discard');
                    expect(this.deadManSChest.amber).toBe(4);
                    expect(this.player1.amber).toBe(2);
                    expect(this.player2.amber).toBe(1);
                    this.player2.endTurn();
                });
            });

            describe('when controller destroys 6 creatures and it is ready', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('untamed');
                    this.player2.endTurn();
                    this.player1.clickPrompt('shadows');

                    this.player1.fightWith(this.badPenny, this.bumblebird);
                    this.player1.fightWith(this.murkens, this.piranhaMonkeys);
                    this.player1.fightWith(this.dodger, this.fuzzyGruen);
                });

                it('should gain the 4A', function () {
                    expect(this.deadManSChest.amber).toBe(0);
                    expect(this.player1.amber).toBe(6);
                    expect(this.player2.amber).toBe(1);
                    this.player1.endTurn();
                });
            });

            describe('when opponent destroys 6 creatures and it is ready', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('untamed');
                    this.player2.fightWith(this.bumblebird, this.badPenny);
                    this.player2.fightWith(this.piranhaMonkeys, this.murkens);
                    this.player2.fightWith(this.fuzzyGruen, this.dodger);
                });

                it('should gain the 4A', function () {
                    expect(this.deadManSChest.amber).toBe(0);
                    expect(this.player1.amber).toBe(2);
                    expect(this.player2.amber).toBe(5);
                    this.player2.endTurn();
                });
            });
        });
    });

    describe("Dead Man's Chest's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    amber: 1,
                    hand: ['dead-man-s-chest'],
                    inPlay: [
                        'mastermindy',
                        'shoulder-id',
                        'hookmaster',
                        'horrid-synan',
                        'giltspine-netcaster',
                        'gas-pipes-malone'
                    ]
                },
                player2: {
                    amber: 1,
                    hand: ['final-analysis'],
                    inPlay: ['infomorph', 'edai-edie-4x4', 'bilgewarden']
                }
            });

            this.player1.play(this.deadManSChest);
            this.player1.clickCard(this.infomorph);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
        });

        it('should gain the 4A after a board wipe', function () {
            this.player2.play(this.finalAnalysis);
            expect(this.deadManSChest.amber).toBe(0);
            expect(this.player1.amber).toBe(2);
            expect(this.player2.amber).toBe(5);
            this.player2.endTurn();
        });
    });
});
