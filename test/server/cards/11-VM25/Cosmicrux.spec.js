describe('Cosmicrux', function () {
    describe("Cosmicrux's abilities", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['cosmicrux', 'troll']
                },
                player2: {
                    inPlay: ['charette']
                }
            });
        });

        it('deals 1 damage to a friendly creature when it readies', function () {
            this.troll.exhaust();
            this.player1.endTurn();
            expect(this.troll.damage).toBe(1);
            expect(this.cosmicrux.damage).toBe(0);
            expect(this.charette.damage).toBe(0);
            this.player2.clickPrompt('dis');
            expect(this.player2).isReadyToTakeAction();
        });

        it("deals 1 damage to an opponent's creature when it readies", function () {
            this.charette.exhaust();
            this.player1.endTurn();
            this.player2.clickPrompt('Dis');
            this.player2.endTurn();
            expect(this.troll.damage).toBe(0);
            expect(this.cosmicrux.damage).toBe(0);
            expect(this.charette.damage).toBe(1);
            this.player1.clickPrompt('brobnar');
            expect(this.player1).isReadyToTakeAction();
        });

        it('prompts for trigger order when multiple creatures ready', function () {
            this.troll.exhaust();
            this.cosmicrux.exhaust();
            this.player1.endTurn();
            this.player1.clickCard(this.cosmicrux);
            expect(this.troll.damage).toBe(1);
            expect(this.cosmicrux.damage).toBe(1);
            expect(this.charette.damage).toBe(0);
            this.player2.clickPrompt('dis');
            expect(this.player2).isReadyToTakeAction();
        });

        it('auto-resolves all triggers when orderForcedAbilities is disabled', function () {
            this.player1.player.optionSettings.orderForcedAbilities = false;
            this.troll.exhaust();
            this.cosmicrux.exhaust();
            this.player1.endTurn();
            expect(this.troll.damage).toBe(1);
            expect(this.cosmicrux.damage).toBe(1);
            expect(this.charette.damage).toBe(0);
            this.player2.clickPrompt('dis');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('Cosmicrux readies before its damage applies', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['cosmicrux', 'troll', 'physaloha']
                },
                player2: {}
            });
        });

        it('readies an undamaged creature, then Cosmicrux deals damage to it', function () {
            this.troll.exhaust();
            this.player1.endTurn();
            expect(this.troll.exhausted).toBe(false);
            expect(this.troll.damage).toBe(1);
            expect(this.player1);
            this.player2.clickPrompt('untamed');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('Cosmicrux + The Chosen One', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'sanctum',
                    inPlay: ['the-chosen-one']
                },
                player2: {
                    house: 'brobnar',
                    inPlay: ['cosmicrux', 'troll']
                }
            });
        });

        it('does not deal damage when The Chosen One replaces the ready cards step', function () {
            this.troll.exhaust();
            this.cosmicrux.exhaust();
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            expect(this.troll.exhausted).toBe(true);
            expect(this.troll.damage).toBe(0);
            expect(this.cosmicrux.exhausted).toBe(true);
            expect(this.cosmicrux.damage).toBe(0);
            expect(this.theChosenOne.damage).toBe(2);
            this.player1.clickPrompt('sanctum');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Cosmicrux + Old Egad', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['cosmicrux', 'urchin', 'old-egad', 'umbra']
                },
                player2: {}
            });
            this.oldEgad.armorUsed = this.oldEgad.armor;
        });

        it("orders triggers so Old Egad's destroyed effect wards Umbra after damage", function () {
            this.urchin.exhaust();
            this.oldEgad.exhaust();
            this.umbra.exhaust();
            this.player1.endTurn();
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.umbra);
            expect(this.urchin.location).toBe('discard');
            expect(this.oldEgad.location).toBe('discard');
            expect(this.umbra.location).toBe('play area');
            expect(this.umbra.damage).toBe(1);
            expect(this.umbra.warded).toBe(true);
            this.player2.clickPrompt('shadows');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('Cosmicrux + Clay More', function () {
        describe('with two Cosmicruxes', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'shadows',
                        inPlay: ['troll', 'clay-more', 'umbra']
                    },
                    player2: {
                        inPlay: ['cosmicrux', 'cosmicrux']
                    }
                });
                this.damagedCosmicrux = this.player2.inPlay[0];
                this.damagedCosmicrux.damage = 4;
                this.undamagedCosmicrux = this.player2.inPlay[1];
            });

            it('destroying the damaged Cosmicrux via Clay More cancels its remaining triggers', function () {
                this.troll.exhaust();
                this.clayMore.exhaust();
                this.umbra.exhaust();
                this.player1.endTurn();

                // Pick the undamaged Cosmicrux as the source for the first trigger
                this.player1.clickCard(this.undamagedCosmicrux);
                this.player1.clickCard(this.clayMore);
                expect(this.clayMore.location).toBe('discard');
                expect(this.damagedCosmicrux.location).toBe('discard');
                expect(this.undamagedCosmicrux.damage).toBe(2);
                // Damaged Cosmicrux's pending triggers are cancelled.

                // Resolve undamaged Cosmicrux's remaining triggers.
                this.player1.clickCard(this.troll);
                // Last trigger auto-resolves on Umbra
                expect(this.troll.location).toBe('play area');
                expect(this.troll.damage).toBe(1);
                expect(this.umbra.location).toBe('play area');
                expect(this.umbra.damage).toBe(1);
                expect(this.troll.exhausted).toBe(false);
                expect(this.umbra.exhausted).toBe(false);
                expect(this.undamagedCosmicrux.location).toBe('play area');

                this.player2.clickPrompt('brobnar');
                expect(this.player2).isReadyToTakeAction();
            });
        });

        describe('with a single damaged Cosmicrux', function () {
            beforeEach(function () {
                this.setupTest({
                    player1: {
                        house: 'brobnar',
                        inPlay: ['clay-more', 'troll']
                    },
                    player2: {
                        inPlay: ['cosmicrux']
                    }
                });
                this.cosmicrux.damage = 4;
            });

            it("cancels Cosmicrux's pending triggers when Cosmicrux is destroyed mid-window", function () {
                this.clayMore.exhaust();
                this.troll.exhaust();
                this.player1.endTurn();
                this.player1.clickCard(this.clayMore);
                expect(this.clayMore.location).toBe('discard');
                expect(this.cosmicrux.location).toBe('discard');
                expect(this.troll.damage).toBe(0);
                expect(this.troll.location).toBe('play area');
                this.player2.clickPrompt('brobnar');
                expect(this.player2).isReadyToTakeAction();
            });
        });
    });

    describe('Cosmicrux + Giltspine Mesmerist', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll', 'urchin']
                },
                player2: {
                    inPlay: ['cosmicrux', 'giltspine-mesmerist']
                }
            });
        });

        it('resolves all Cosmicrux triggers first, then Giltspine Mesmerist', function () {
            this.troll.exhaust();
            this.urchin.exhaust();
            const initialDiscard = this.player1.player.discard.length;
            this.player1.endTurn();
            // Resolve both Cosmicrux triggers first (urchin dies to 1 damage)
            this.player1.clickCard(this.cosmicrux);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.cosmicrux); // only one Cosmicrux event left, auto-targets troll
            // Giltspine auto-resolves with no other abilities triggering

            expect(this.troll.damage).toBe(1);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1.player.discard.length).toBe(initialDiscard + 3); // urchin + 2 deck discards
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('resolves all Giltspine Mesmerist triggers first, then Cosmicrux', function () {
            this.troll.exhaust();
            this.urchin.exhaust();
            const initialDiscard = this.player1.player.discard.length;
            this.player1.endTurn();
            // Resolve Giltspine triggers
            this.player1.clickCard(this.giltspineMesmerist);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.giltspineMesmerist);

            // Resolve Cosmicrux triggers
            this.player1.clickCard(this.troll);
            // auto-resolve last Cosmicrux trigger on urchin

            expect(this.troll.damage).toBe(1);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1.player.discard.length).toBe(initialDiscard + 3); // 2 deck discards + urchin
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('interleaves Cosmicrux and Giltspine Mesmerist triggers', function () {
            this.troll.exhaust();
            this.urchin.exhaust();
            const initialDiscard = this.player1.player.discard.length;
            this.player1.endTurn();
            this.player1.clickCard(this.cosmicrux);
            this.player1.clickCard(this.urchin);
            this.player1.clickCard(this.giltspineMesmerist);
            this.player1.clickCard(this.urchin); // from discard
            this.player1.clickCard(this.giltspineMesmerist);
            // Giltspine auto-resolves troll discard
            // Last Cosmicrux trigger auto-resolves on urchin

            expect(this.troll.damage).toBe(1);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1.player.discard.length).toBe(initialDiscard + 3); // 2 deck discards + urchin
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });

        it('has the option to autoresolve Cosmicrux and Giltspine Mesmerist triggers', function () {
            this.troll.exhaust();
            this.urchin.exhaust();
            const initialDiscard = this.player1.player.discard.length;
            this.player1.endTurn();
            this.player1.clickPrompt('Autoresolve');
            expect(this.troll.damage).toBe(1);
            expect(this.urchin.location).toBe('discard');
            expect(this.player1.player.discard.length).toBe(initialDiscard + 3);
            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('Cosmicrux + Giltspine Mesmerist + Poised Strike', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['ember-imp', 'troll'],
                    hand: ['poised-strike']
                },
                player2: {
                    inPlay: ['cosmicrux', 'giltspine-mesmerist']
                }
            });
        });

        it('interleaves Cosmicrux, Giltspine Mesmerist, and Poised Strike triggers', function () {
            this.player1.playUpgrade(this.poisedStrike, this.emberImp);
            this.player1.reap(this.emberImp);
            this.troll.exhaust();
            const initialDiscard = this.player1.player.discard.length;
            this.player1.endTurn();

            this.player1.clickCard(this.cosmicrux);
            this.player1.clickCard(this.troll);
            expect(this.troll.damage).toBe(1);

            this.player1.clickCard(this.giltspineMesmerist);
            this.player1.clickCard(this.troll);
            expect(this.player1.player.discard.length).toBe(initialDiscard + 1);

            this.player1.clickCard(this.cosmicrux);
            // Auto-resolve ember-imp damage
            expect(this.emberImp.damage).toBe(1);
            expect(this.emberImp.location).toBe('play area');

            this.player1.clickCard(this.giltspineMesmerist);
            // Auto-resolve ember-imp discard

            // Poised Strike auto-resolves
            expect(this.emberImp.location).toBe('discard');
            expect(this.poisedStrike.location).toBe('discard');
            expect(this.player1.player.discard.length).toBe(initialDiscard + 4);

            this.player2.clickPrompt('brobnar');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
