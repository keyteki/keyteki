describe('Ruins of Archonis', function () {
    describe("Ruins of Archonis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 1,
                    hand: [
                        'ruins-of-archonis',
                        'archimedes',
                        'science',
                        'batdrone',
                        'animator',
                        'anomaly-exploiter',
                        'backup-copy',
                        'halacor'
                    ],
                    inPlay: ['toad', 'flaxia', 'niffle-ape']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'troll', 'groggins'],
                    hand: [
                        'ember-imp',
                        'ember-imp',
                        'ember-imp',
                        'ember-imp',
                        'ember-imp',
                        'ember-imp'
                    ]
                }
            });

            this.player1.play(this.ruinsOfArchonis);
        });

        it('should be able to select a card to archive', function () {
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).toBeAbleToSelect(this.science);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            expect(this.player1).toBeAbleToSelect(this.animator);
            expect(this.player1).toBeAbleToSelect(this.anomalyExploiter);
            expect(this.player1).toBeAbleToSelect(this.backupCopy);
            expect(this.player1).toBeAbleToSelect(this.halacor);
            expect(this.player1).not.toBeAbleToSelect(this.ruinsOfArchonis);
        });

        describe('and a card is selected', function () {
            beforeEach(function () {
                this.player1.clickCard(this.halacor);
            });

            it('should archive the card and place 4 amber on it after play', function () {
                expect(this.halacor.location).toBe('archives');
                expect(this.ruinsOfArchonis.amber).toBe(4);
            });

            describe('when controller plays 6 cards, but it is not ready', function () {
                beforeEach(function () {
                    this.player1.play(this.science);
                    this.player1.play(this.archimedes);
                    this.player1.play(this.batdrone);
                    this.player1.play(this.anomalyExploiter);
                    this.player1.play(this.animator);
                    this.player1.playUpgrade(this.backupCopy, this.batdrone);
                });

                it('should not gain the 4A', function () {
                    expect(this.ruinsOfArchonis.amber).toBe(4);
                    expect(this.player1.amber).toBe(3);
                    expect(this.player2.amber).toBe(1);
                    this.player1.endTurn();
                });
            });

            describe('when opponent plays 6 cards, but it is not ready', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('dis');
                    this.ruinsOfArchonis.exhaust();
                    this.player2.play(this.player2.player.hand[5]);
                    this.player2.play(this.player2.player.hand[4]);
                    this.player2.play(this.player2.player.hand[3]);
                    this.player2.play(this.player2.player.hand[2]);
                    this.player2.play(this.player2.player.hand[1]);
                    this.player2.play(this.player2.player.hand[0]);
                });

                it('should not gain the 4A', function () {
                    expect(this.ruinsOfArchonis.amber).toBe(4);
                    expect(this.player1.amber).toBe(2);
                    expect(this.player2.amber).toBe(1);
                    this.player2.endTurn();
                });
            });

            describe('when controller plays 6 cards and it is ready', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('dis');
                    this.player2.endTurn();
                    this.player1.clickPrompt('logos');
                    this.player1.clickPrompt('No');

                    this.player1.play(this.science);
                    this.player1.play(this.archimedes);
                    this.player1.play(this.batdrone);
                    this.player1.play(this.anomalyExploiter);
                    this.player1.play(this.animator);
                    this.player1.playUpgrade(this.backupCopy, this.batdrone);
                });

                it('should gain the 4A', function () {
                    expect(this.ruinsOfArchonis.amber).toBe(0);
                    expect(this.player1.amber).toBe(7);
                    expect(this.player2.amber).toBe(1);
                    this.player1.endTurn();
                });
            });

            describe('when opponent plays 6 cards and it is ready', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('dis');
                    this.player2.play(this.player2.player.hand[5]);
                    this.player2.play(this.player2.player.hand[4]);
                    this.player2.play(this.player2.player.hand[3]);
                    this.player2.play(this.player2.player.hand[2]);
                    this.player2.play(this.player2.player.hand[1]);
                    this.player2.play(this.player2.player.hand[0]);
                });

                it('should gain the 4A', function () {
                    expect(this.ruinsOfArchonis.amber).toBe(0);
                    expect(this.player1.amber).toBe(2);
                    expect(this.player2.amber).toBe(5);
                    this.player2.endTurn();
                });
            });
        });
    });
});
