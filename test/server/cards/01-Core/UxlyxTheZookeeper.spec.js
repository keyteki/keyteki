describe('Uxlyx the Zookeeper', function () {
    describe("Uxlyx the Zookeeper's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['uxlyx-the-zookeeper', 'urchin'],
                    hand: ['mothership-support']
                },
                player2: {
                    inPlay: ['batdrone']
                }
            });
        });

        it('should trigger when Uxlyx reaps', function () {
            this.player1.reap(this.uxlyxTheZookeeper);
            expect(this.player1).toHavePrompt('Uxlyx the Zookeeper');
            expect(this.player1).not.toBeAbleToSelect(this.uxlyxTheZookeeper);
            expect(this.player1).not.toBeAbleToSelect(this.urchin);
            expect(this.player1).toBeAbleToSelect(this.batdrone);
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('archives');
            expect(this.player1.archives).toContain(this.batdrone);
        });

        it('should not trigger when there are no enemy creatures', function () {
            this.player1.play(this.mothershipSupport);
            expect(this.player1).toHavePrompt('Mothership Support');
            this.player1.clickCard(this.batdrone);
            expect(this.batdrone.location).toBe('discard');
            this.player1.reap(this.uxlyxTheZookeeper);
            expect(this.player1).isReadyToTakeAction();
        });

        it("should return creatures to their owner's hand", function () {
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.batdrone);
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            expect(this.player1).toHavePrompt('Access Archives');
            this.player1.clickPrompt('Yes');
            expect(this.batdrone.location).toBe('hand');
            expect(this.player2.hand).toContain(this.batdrone);
        });
    });

    describe('Uxlyx the Zookeeper with Murkens', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['uxlyx-the-zookeeper'],
                    hand: ['scowly-caper']
                },
                player2: {
                    inPlay: ['ember-imp'],
                    hand: ['murkens']
                }
            });
            this.player1.makeMaverick(this.scowlyCaper, 'mars');
        });

        it("should return unowned creature to owner's hand when Murkens tries to play it from archives", function () {
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.emberImp);
            expect(this.player1.archives).toContain(this.emberImp);
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playCreature(this.murkens);
            this.player2.clickPrompt('Random card from archives');
            expect(this.player2.hand).toContain(this.emberImp);
            expect(this.player2.discard).not.toContain(this.emberImp);
            expect(this.player1.archives).not.toContain(this.emberImp);
            expect(this.player2).isReadyToTakeAction();
        });

        it('should return owned creature to hand when Murkens tries to play it from archives', function () {
            this.player1.playCreature(this.scowlyCaper);
            expect(this.scowlyCaper.controller).toBe(this.player2.player);
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.scowlyCaper);
            expect(this.player1.archives).toContain(this.scowlyCaper);
            expect(this.player1).isReadyToTakeAction();
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.playCreature(this.murkens);
            this.player2.clickPrompt('Random card from archives');
            expect(this.player1.archives).not.toContain(this.scowlyCaper);
            expect(this.player1.hand).toContain(this.scowlyCaper);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('Uxlyx the Zookeeper with Animator', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['uxlyx-the-zookeeper', 'animator'],
                    hand: ['yzphyz-knowdrone']
                },
                player2: {
                    inPlay: ['gauntlet-of-command']
                }
            });
            this.player1.makeMaverick(this.animator, 'mars');
        });

        it("should return abducted artifact-turned-creature to owner's hand when leaving archives", function () {
            this.player1.useAction(this.animator);
            this.player1.clickCard(this.gauntletOfCommand);
            this.player1.clickPrompt('Left');
            expect(this.gauntletOfCommand.type).toBe('creature');
            expect(this.gauntletOfCommand.controller).toBe(this.player2.player);

            // Zookeeper abducts the artifact-turned-creature
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.gauntletOfCommand);
            expect(this.gauntletOfCommand.location).toBe('archives');
            expect(this.player1.archives).toContain(this.gauntletOfCommand);

            // Use Yzphyz Knowdrone to purge from archives - should return to owner's hand
            this.player1.playCreature(this.yzphyzKnowdrone);
            this.player1.clickCard(this.gauntletOfCommand);
            expect(this.gauntletOfCommand.location).toBe('hand');
            expect(this.player2.hand).toContain(this.gauntletOfCommand);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Uxlyx the Zookeeper with gigantic creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['uxlyx-the-zookeeper'],
                    hand: ['yzphyz-knowdrone', 'zorg', 'crop-circles']
                },
                player2: {
                    hand: ['ultra-gravitron', 'ultra-gravitron2']
                }
            });
        });

        it("should return both halves of abducted gigantic creature to owner's hand", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('logos');
            this.player2.playCreature(this.ultraGravitron);
            expect(this.ultraGravitron.location).toBe('play area');
            this.player2.endTurn();

            this.player1.clickPrompt('mars');
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.ultraGravitron);
            expect(this.ultraGravitron.location).toBe('archives');
            expect(this.ultraGravitron2.location).toBe('archives');
            expect(this.player1.archives).toContain(this.ultraGravitron);
            expect(this.player1.archives).toContain(this.ultraGravitron2);
            expect(this.ultraGravitron.abducted).toBe(true);
            expect(this.ultraGravitron2.abducted).toBe(true);

            this.player1.play(this.yzphyzKnowdrone);
            this.player1.clickCard(this.zorg);
            this.player1.clickCard(this.ultraGravitron2);
            expect(this.ultraGravitron.location).toBe('archives');
            expect(this.ultraGravitron2.location).toBe('hand');
            expect(this.player1.archives).toContain(this.ultraGravitron);
            expect(this.player2.hand).toContain(this.ultraGravitron2);
            expect(this.ultraGravitron.abducted).toBe(true);
            expect(this.ultraGravitron2.abducted).toBe(false);

            this.player1.play(this.cropCircles);
            this.player1.clickCard(this.ultraGravitron);
            this.player1.clickPrompt('Done');
            expect(this.ultraGravitron.location).toBe('hand');
            expect(this.ultraGravitron2.location).toBe('hand');
            expect(this.player2.hand).toContain(this.ultraGravitron);
            expect(this.player2.hand).toContain(this.ultraGravitron2);
            expect(this.ultraGravitron.abducted).toBe(false);
            expect(this.ultraGravitron2.abducted).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Uxlyx the Zookeeper with token creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    inPlay: ['uxlyx-the-zookeeper'],
                    hand: ['yzphyz-knowdrone', 'zorg']
                },
                player2: {
                    token: 'grumpus',
                    hand: ['muster', 'troll']
                }
            });
        });

        it("should return abducted token creature to owner's hand", function () {
            this.player2.moveCard(this.troll, 'deck');
            this.player1.endTurn();
            this.player2.clickPrompt('sanctum');
            this.player2.play(this.muster);
            expect(this.troll.location).toBe('play area');
            expect(this.troll.name).toBe('Grumpus');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.reap(this.uxlyxTheZookeeper);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('archives');
            expect(this.player1.archives).toContain(this.troll);

            // Use Yzphyz Knowdrone to purge from archives - should return to owner's hand
            this.player1.play(this.yzphyzKnowdrone);
            this.player1.clickCard(this.zorg);
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('hand');
            expect(this.player2.hand).toContain(this.troll);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
