describe('SLRS Austeralis', function () {
    describe("SLRS Austeralis's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['wild-wormhole', 'library-access', 'archimedes', 'brain-eater'],
                    inPlay: [
                        'slrs-austeralis',
                        'ganymede-archivist',
                        'helper-bot',
                        'flaxia',
                        'archimedes',
                        'animator'
                    ],
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
                    inPlay: ['shooler', 'lyco-bot']
                }
            });
        });

        it('should be optional', function () {
            this.player1.moveCard(this.wayOfTheBear, 'deck');
            this.player1.moveCard(this.gauntletOfCommand, 'deck');
            this.player1.moveCard(this.dextre, 'deck');

            this.player1.useAction(this.slrsAusteralis);
            this.player1.clickPrompt('Done');
            this.player1.endTurn();
        });

        it('should play all cards on top of the deck', function () {
            this.player1.moveCard(this.wayOfTheBear, 'deck');
            this.player1.moveCard(this.gauntletOfCommand, 'deck');
            this.player1.moveCard(this.dextre, 'deck');

            this.player1.useAction(this.slrsAusteralis);

            expect(this.player1).toBeAbleToSelect(this.ganymedeArchivist);
            expect(this.player1).toBeAbleToSelect(this.helperBot);
            expect(this.player1).toBeAbleToSelect(this.archimedes);
            expect(this.player1).not.toBeAbleToSelect(this.animator);
            expect(this.player1).not.toBeAbleToSelect(this.flaxia);
            expect(this.player1).not.toBeAbleToSelect(this.shooler);
            expect(this.player1).not.toBeAbleToSelect(this.lycoBot);

            this.player1.clickCard(this.helperBot);
            this.player1.clickCard(this.ganymedeArchivist);
            this.player1.clickCard(this.archimedes);
            this.player1.clickPrompt('Done');

            expect(this.archimedes.exhausted).toBe(true);
            expect(this.helperBot.exhausted).toBe(true);
            expect(this.ganymedeArchivist.exhausted).toBe(true);

            // Dextre
            this.player1.clickPrompt('Right');
            expect(this.dextre.location).toBe('play area');
            // Gauntlet of Command
            expect(this.gauntletOfCommand.location).toBe('play area');
            // Way of the bear
            expect(this.player1).toHavePrompt('Way of the Bear');
            this.player1.clickCard(this.ganymedeArchivist);
            expect(this.wayOfTheBear.location).toBe('play area');
            expect(this.wayOfTheBear.parent).toBe(this.ganymedeArchivist);
            this.player1.endTurn();
        });

        it('should play only 1 card if 2 of the creatures were already exhausted', function () {
            this.archimedes.exhaust();
            this.helperBot.exhaust();

            this.player1.moveCard(this.wayOfTheBear, 'deck');
            this.player1.moveCard(this.gauntletOfCommand, 'deck');
            this.player1.moveCard(this.dextre, 'deck');

            this.player1.useAction(this.slrsAusteralis);

            this.player1.clickCard(this.helperBot);
            this.player1.clickCard(this.ganymedeArchivist);
            this.player1.clickCard(this.archimedes);
            this.player1.clickPrompt('Done');

            expect(this.archimedes.exhausted).toBe(true);
            expect(this.helperBot.exhausted).toBe(true);
            expect(this.ganymedeArchivist.exhausted).toBe(true);

            // Dextre
            this.player1.clickPrompt('Right');
            expect(this.dextre.location).toBe('play area');

            expect(this.gauntletOfCommand.location).toBe('deck');
            expect(this.wayOfTheBear.location).toBe('deck');

            this.player1.endTurn();
        });

        it('should play an action from the top of the deck', function () {
            this.player1.moveCard(this.anger, 'deck');
            expect(this.anger.location).toBe('deck');
            this.player1.useAction(this.slrsAusteralis);
            this.player1.clickCard(this.archimedes);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Anger');
            this.player1.clickCard(this.ganymedeArchivist);
            expect(this.player1).toHavePrompt('Choose a creature to attack');
            this.player1.clickCard(this.shooler);
            expect(this.ganymedeArchivist.location).toBe('discard');
            expect(this.anger.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should keep an alpha card on the top of the deck', function () {
            this.player1.moveCard(this.eureka, 'deck');
            this.player1.useAction(this.slrsAusteralis);

            this.player1.clickCard(this.helperBot);
            this.player1.clickCard(this.ganymedeArchivist);
            this.player1.clickCard(this.archimedes);
            this.player1.clickPrompt('Done');

            expect(this.archimedes.exhausted).toBe(true);
            expect(this.helperBot.exhausted).toBe(true);
            expect(this.ganymedeArchivist.exhausted).toBe(true);

            expect(this.eureka.location).toBe('deck');
            this.player1.endTurn();
        });
    });
});
