describe('Prof. Emeritus Kering', function () {
    describe("Prof. Emeritus Kering's play ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    inPlay: ['dextre', 'archimedes'],
                    hand: ['prof-emeritus-kering']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'lamindra']
                }
            });
        });

        describe('when tide is not high', function () {
            describe('when played next to a single creature', function () {
                beforeEach(function () {
                    this.player1.play(this.profEmeritusKering);
                });

                it('should be able to choose any of the neighbors', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.profEmeritusKering);
                    expect(this.player1).not.toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.archimedes);
                });

                it('should be able to use its neighbor to reap', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Reap with this creature');
                    expect(this.player1.amber).toBe(2);
                    this.player1.endTurn();
                });

                it('should be able to use its neighbor to fight', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    expect(this.archimedes.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });
            });

            describe('when played next to two creatures', function () {
                beforeEach(function () {
                    this.player1.play(this.profEmeritusKering, true, true);
                    this.player1.clickCard(this.archimedes);
                });

                it('should be able to choose any of the neighbors', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.profEmeritusKering);
                    expect(this.player1).toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.archimedes);
                });

                it('should be able to use only the chosen neighbor to reap', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Reap with this creature');
                    expect(this.player1.amber).toBe(2);
                    this.player1.endTurn();
                });

                it('should be able to use only the chosen neighbor to fight', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    expect(this.archimedes.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });
            });
        });

        describe('when tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            describe('when played next to a single creature', function () {
                beforeEach(function () {
                    this.player1.play(this.profEmeritusKering);
                });

                it('should be able to choose any of the neighbors', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.profEmeritusKering);
                    expect(this.player1).not.toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.archimedes);
                });

                it('should be able to use its neighbor to reap', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Reap with this creature');
                    expect(this.player1.amber).toBe(2);
                    this.player1.endTurn();
                });

                it('should be able to use its neighbor to fight', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    expect(this.archimedes.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });
            });

            describe('when played next to two creatures', function () {
                beforeEach(function () {
                    this.player1.play(this.profEmeritusKering, true, true);
                    this.player1.clickCard(this.archimedes);
                });

                it('should be able to choose any of the neighbors', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.profEmeritusKering);
                    expect(this.player1).toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.archimedes);
                });

                it('should be able to use the chosen neighbor to reap and the second neighbor to fight', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Reap with this creature');
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    expect(this.player1.amber).toBe(2);
                    expect(this.dextre.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });

                it('should be able to use only the chosen neighbor to fight and the second neighbor to reap', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    this.player1.clickPrompt('Reap with this creature');
                    expect(this.player1.amber).toBe(2);
                    expect(this.archimedes.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });
            });
        });
    });

    describe("Prof. Emeritus Kering's reap ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    inPlay: ['dextre', 'prof-emeritus-kering', 'archimedes']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'lamindra']
                }
            });
        });

        describe('when tide is not high', function () {
            describe('when next to a single creature', function () {
                beforeEach(function () {
                    this.player1.moveCard(this.dextre, 'discard');
                    this.player1.reap(this.profEmeritusKering);
                });

                it('should be able to choose any of the neighbors', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.profEmeritusKering);
                    expect(this.player1).not.toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.archimedes);
                });

                it('should be able to use its neighbor to reap', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Reap with this creature');
                    expect(this.player1.amber).toBe(3);
                    this.player1.endTurn();
                });

                it('should be able to use its neighbor to fight', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    expect(this.archimedes.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });
            });

            describe('when next to two creatures', function () {
                beforeEach(function () {
                    this.player1.reap(this.profEmeritusKering);
                });

                it('should be able to choose any of the neighbors', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.profEmeritusKering);
                    expect(this.player1).toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.archimedes);
                });

                it('should be able to use only the chosen neighbor to reap', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Reap with this creature');
                    expect(this.player1.amber).toBe(3);
                    this.player1.endTurn();
                });

                it('should be able to use only the chosen neighbor to fight', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    expect(this.archimedes.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });
            });
        });

        describe('when tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            describe('when next to a single creature', function () {
                beforeEach(function () {
                    this.player1.moveCard(this.dextre, 'discard');
                    this.player1.reap(this.profEmeritusKering);
                });

                it('should be able to choose any of the neighbors', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.profEmeritusKering);
                    expect(this.player1).not.toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.archimedes);
                });

                it('should be able to use its neighbor to reap', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Reap with this creature');
                    expect(this.player1.amber).toBe(3);
                    this.player1.endTurn();
                });

                it('should be able to use its neighbor to fight', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    expect(this.archimedes.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });
            });

            describe('when next to two creatures', function () {
                beforeEach(function () {
                    this.player1.reap(this.profEmeritusKering);
                });

                it('should be able to choose any of the neighbors', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.profEmeritusKering);
                    expect(this.player1).toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.archimedes);
                });

                it('should be able to use the chosen neighbor to reap and the second neighbor to fight', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Reap with this creature');
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    expect(this.player1.amber).toBe(3);
                    expect(this.dextre.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });

                it('should be able to use only the chosen neighbor to fight and the second neighbor to reap', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    this.player1.clickPrompt('Reap with this creature');
                    expect(this.player1.amber).toBe(3);
                    expect(this.archimedes.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });
            });
        });
    });

    describe("Prof. Emeritus Kering's fight ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    amber: 1,
                    inPlay: ['dextre', 'prof-emeritus-kering', 'archimedes']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump', 'lamindra']
                }
            });
        });

        describe('when tide is not high', function () {
            describe('when next to a single creature', function () {
                beforeEach(function () {
                    this.player1.moveCard(this.dextre, 'discard');
                    this.player1.fightWith(this.profEmeritusKering, this.lamindra);
                });

                it('should be able to choose any of the neighbors', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.profEmeritusKering);
                    expect(this.player1).not.toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.archimedes);
                });

                it('should be able to use its neighbor to reap', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Reap with this creature');
                    expect(this.player1.amber).toBe(2);
                    this.player1.endTurn();
                });

                it('should be able to use its neighbor to fight', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    expect(this.archimedes.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });
            });

            describe('when next to two creatures', function () {
                beforeEach(function () {
                    this.player1.fightWith(this.profEmeritusKering, this.lamindra);
                });

                it('should be able to choose any of the neighbors', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.profEmeritusKering);
                    expect(this.player1).toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.archimedes);
                });

                it('should be able to use only the chosen neighbor to reap', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Reap with this creature');
                    expect(this.player1.amber).toBe(2);
                    this.player1.endTurn();
                });

                it('should be able to use only the chosen neighbor to fight', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    expect(this.archimedes.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });
            });
        });

        describe('when tide is high', function () {
            beforeEach(function () {
                this.player1.raiseTide();
            });

            describe('when next to a single creature', function () {
                beforeEach(function () {
                    this.player1.moveCard(this.dextre, 'discard');
                    this.player1.fightWith(this.profEmeritusKering, this.lamindra);
                });

                it('should be able to choose any of the neighbors', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.profEmeritusKering);
                    expect(this.player1).not.toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.archimedes);
                });

                it('should be able to use its neighbor to reap', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Reap with this creature');
                    expect(this.player1.amber).toBe(2);
                    this.player1.endTurn();
                });

                it('should be able to use its neighbor to fight', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    expect(this.archimedes.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });
            });

            describe('when next to two creatures', function () {
                beforeEach(function () {
                    this.player1.fightWith(this.profEmeritusKering, this.lamindra);
                });

                it('should be able to choose any of the neighbors', function () {
                    expect(this.player1).not.toBeAbleToSelect(this.profEmeritusKering);
                    expect(this.player1).toBeAbleToSelect(this.dextre);
                    expect(this.player1).toBeAbleToSelect(this.archimedes);
                });

                it('should be able to use the chosen neighbor to reap and the second neighbor to fight', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Reap with this creature');
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    expect(this.player1.amber).toBe(2);
                    expect(this.dextre.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });

                it('should be able to use only the chosen neighbor to fight and the second neighbor to reap', function () {
                    this.player1.clickCard(this.archimedes);
                    this.player1.clickPrompt('Fight with this creature');
                    this.player1.clickCard(this.gub);
                    this.player1.clickPrompt('Reap with this creature');
                    expect(this.player1.amber).toBe(2);
                    expect(this.archimedes.damage).toBe(1);
                    expect(this.gub.location).toBe('discard');
                    this.player1.endTurn();
                });
            });
        });
    });

    describe('dynamic neighbor resolution', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'staralliance',
                    inPlay: ['snufflegator', 'prof-emeritus-kering', 'dew-faerie', 'niffle-ape'],
                    hand: ['chan-s-blaster']
                },
                player2: {}
            });

            this.player1.raiseTide();
        });

        // TODO: this is questionable: https://discord.com/channels/563737400275107920/588586239997902858/1509301040980169006
        it('should use the new neighbor if the original other neighbor is destroyed by the first use', function () {
            this.player1.playUpgrade(this.chanSBlaster, this.snufflegator);
            this.player1.reap(this.profEmeritusKering);

            // Reap with Snufflegator
            this.player1.clickCard(this.snufflegator);

            // Chan's Blaster
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Deal 2 damage');
            this.player1.clickCard(this.dewFaerie);

            // Autoresolve reap with Niffle Ape
            expect(this.player1.amber).toBe(4);
            expect(this.snufflegator.exhausted).toBe(true);
            expect(this.profEmeritusKering.exhausted).toBe(true);
            expect(this.dewFaerie.location).toBe('discard');
            expect(this.niffleApe.exhausted).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should still use neighbor if Kering is destroyed', function () {
            this.player1.playUpgrade(this.chanSBlaster, this.snufflegator);
            this.player1.reap(this.profEmeritusKering);

            // Reap with Snufflegator
            this.player1.clickCard(this.snufflegator);

            // Chan's Blaster
            this.player1.clickCard(this.snufflegator);
            this.player1.clickPrompt('Deal 2 damage');
            this.player1.clickCard(this.profEmeritusKering);

            // Autoresolve reap with Dew Faerie
            expect(this.player1.amber).toBe(5);
            expect(this.snufflegator.exhausted).toBe(true);
            expect(this.profEmeritusKering.location).toBe('discard');
            expect(this.dewFaerie.exhausted).toBe(true);
            expect(this.niffleApe.exhausted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
