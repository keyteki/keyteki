describe('Wild Wormhole', function () {
    describe("Wild Wormhole's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['wild-wormhole', 'library-access', 'archimedes', 'brain-eater'],
                    inPlay: ['ganymede-archivist'],
                    discard: [
                        'dextre',
                        'way-of-the-bear',
                        'anger',
                        'gauntlet-of-command',
                        'eureka',
                        'kelifi-dragon'
                    ]
                },
                player2: {
                    inPlay: ['inka-the-spider', 'ember-imp']
                }
            });
        });

        it('should play a creature on top of the deck', function () {
            this.player1.moveCard(this.dextre, 'deck');
            expect(this.dextre.location).toBe('deck');
            this.player1.play(this.wildWormhole);
            expect(this.player1).toHavePrompt('Dextre');
            this.player1.clickPrompt('Right');
            expect(this.dextre.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should play an artifact on top of the deck', function () {
            this.player1.moveCard(this.gauntletOfCommand, 'deck');
            expect(this.gauntletOfCommand.location).toBe('deck');
            this.player1.play(this.wildWormhole);
            expect(this.gauntletOfCommand.location).toBe('play area');
            expect(this.player1.amber).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should play an upgrade on top of the deck', function () {
            this.player1.moveCard(this.wayOfTheBear, 'deck');
            expect(this.wayOfTheBear.location).toBe('deck');
            this.player1.play(this.wildWormhole);
            expect(this.player1).toHavePrompt('Way of the Bear');
            this.player1.clickCard(this.ganymedeArchivist);
            expect(this.wayOfTheBear.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(2);
        });

        it('should play an action from the top of the deck', function () {
            this.player1.moveCard(this.anger, 'deck');
            expect(this.anger.location).toBe('deck');
            this.player1.play(this.wildWormhole);
            expect(this.player1).toHavePrompt('Anger');
            this.player1.clickCard(this.ganymedeArchivist);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.inkaTheSpider);
            expect(this.ganymedeArchivist.location).toBe('discard');
            expect(this.anger.location).toBe('discard');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(2);
        });

        it('should leave an upgrade on top of the deck if there are no legal targets', function () {
            this.player1.moveCard(this.ganymedeArchivist, 'discard');
            this.player1.moveCard(this.emberImp, 'discard');
            this.player1.moveCard(this.inkaTheSpider, 'discard');
            this.player1.moveCard(this.wayOfTheBear, 'deck');
            expect(this.wayOfTheBear.location).toBe('deck');
            this.player1.play(this.wildWormhole);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(1);
            expect(this.wayOfTheBear.location).toBe('deck');
        });

        it('should keep an alpha card on the top of the deck', function () {
            this.player1.moveCard(this.eureka, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(1);
            expect(this.eureka.location).toBe('deck');
        });

        it('should keep Kelifi Dragon on the top of the deck if not enough amber', function () {
            this.player1.moveCard(this.kelifiDragon, 'deck');
            this.player1.play(this.wildWormhole);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(1);
            expect(this.kelifiDragon.location).toBe('deck');
        });

        it('should not allow playing the 3rd card due to Ember Imp', function () {
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.play(this.archimedes);
            this.player1.play(this.wildWormhole);
            expect(this.player1).isReadyToTakeAction();
            expect(this.player1.amber).toBe(1);
            expect(this.dextre.location).toBe('deck');
        });

        it('should interact correctly with Library Access when playing an upgrade', function () {
            this.player1.moveCard(this.emberImp, 'discard');
            this.player1.moveCard(this.gauntletOfCommand, 'deck');
            this.player1.moveCard(this.wayOfTheBear, 'deck');
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.play(this.libraryAccess);
            expect(this.libraryAccess.location).toBe('purged');
            this.player1.play(this.wildWormhole);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Library Access');
            expect(this.player1).toHavePromptButton('Wild Wormhole');
            this.player1.clickPrompt('Library Access');
            expect(this.dextre.location).toBe('hand');
            expect(this.gauntletOfCommand.location).toBe('deck');
            expect(this.player1).toHavePrompt('Way of the Bear');
            this.player1.clickCard(this.ganymedeArchivist);
            expect(this.gauntletOfCommand.location).toBe('hand');
        });

        it('should interact correctly with Library Access when the upgrade is unplayable', function () {
            this.player1.moveCard(this.ganymedeArchivist, 'discard');
            this.player1.moveCard(this.emberImp, 'discard');
            this.player1.moveCard(this.inkaTheSpider, 'discard');
            this.player1.moveCard(this.gauntletOfCommand, 'deck');
            this.player1.moveCard(this.wayOfTheBear, 'deck');
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.play(this.libraryAccess);
            this.player1.play(this.wildWormhole);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Library Access');
            expect(this.player1).toHavePromptButton('Wild Wormhole');
            this.player1.clickPrompt('Library Access');
            expect(this.dextre.location).toBe('hand');
            expect(this.gauntletOfCommand.location).toBe('deck');
            expect(this.player1).isReadyToTakeAction();
        });

        it('should interact correctly with Library Access when playing an action', function () {
            this.player1.moveCard(this.emberImp, 'discard');
            this.player1.moveCard(this.gauntletOfCommand, 'deck');
            this.player1.moveCard(this.anger, 'deck');
            this.player1.moveCard(this.dextre, 'deck');
            this.player1.play(this.libraryAccess);
            this.player1.play(this.wildWormhole);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Library Access');
            expect(this.player1).toHavePromptButton('Wild Wormhole');
            this.player1.clickPrompt('Library Access');
            expect(this.dextre.location).toBe('hand');
            expect(this.gauntletOfCommand.location).toBe('deck');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePromptButton('Library Access');
            expect(this.player1).toHavePromptButton('Anger');
            this.player1.clickPrompt('Library Access');
            expect(this.gauntletOfCommand.location).toBe('hand');
            expect(this.player1).toHavePrompt('Anger');
        });
    });
});
