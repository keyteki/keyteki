describe('Project Z.Y.X.', function () {
    describe('reap/fight abilitues', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['dextre', 'project-zyx'],
                    hand: [
                        'bumblebird',
                        'binding-irons',
                        'deepwood-druid',
                        'duskwitch',
                        'entropic-swirl'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['lamindra']
                }
            });
        });

        it('should be able optional to play a card after reap', function () {
            this.player1.moveCard(this.bindingIrons, 'archives');
            this.player1.moveCard(this.entropicSwirl, 'archives');
            this.player1.reap(this.projectZyx);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able optional to play a card after fight', function () {
            this.player1.moveCard(this.bindingIrons, 'archives');
            this.player1.moveCard(this.entropicSwirl, 'archives');
            this.player1.fightWith(this.projectZyx, this.lamindra);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should be able to play an archived card after reap', function () {
            this.player1.moveCard(this.bindingIrons, 'archives');
            this.player1.moveCard(this.entropicSwirl, 'archives');
            this.player1.reap(this.projectZyx);
            expect(this.player1).toBeAbleToSelect(this.entropicSwirl);
            expect(this.player1).toBeAbleToSelect(this.bindingIrons);
            this.player1.clickCard(this.bindingIrons);
            expect(this.player2.player.chains).toBe(3);
        });

        it('should be able to play an archived card after fight', function () {
            this.player1.moveCard(this.bindingIrons, 'archives');
            this.player1.moveCard(this.entropicSwirl, 'archives');
            this.player1.fightWith(this.projectZyx, this.lamindra);
            expect(this.player1).toBeAbleToSelect(this.entropicSwirl);
            expect(this.player1).toBeAbleToSelect(this.bindingIrons);
            this.player1.clickCard(this.bindingIrons);
            expect(this.player2.player.chains).toBe(3);
        });

        it('should play and consider deploy effect of card', function () {
            this.player1.moveCard(this.deepwoodDruid, 'archives');
            this.player1.reap(this.projectZyx);
            this.player1.clickCard(this.deepwoodDruid);
            expect(this.player1).toHavePromptButton('Deploy Left');
            expect(this.player1).toHavePromptButton('Deploy Right');
            this.player1.clickPrompt('Deploy Left');
            expect(this.player1).toHavePrompt('Select a card to deploy to the left of');
            this.player1.clickCard(this.projectZyx); // click to position
            this.player1.clickCard(this.projectZyx); // click to fully heal Project Z.Y.X.
            expect(this.deepwoodDruid.location).toBe('play area');
            expect(this.deepwoodDruid.neighbors).toContain(this.projectZyx);
            expect(this.deepwoodDruid.neighbors).toContain(this.dextre);
        });

        it('should not play alpha card and keep card in archives', function () {
            this.player1.moveCard(this.bumblebird, 'archives');
            this.player1.reap(this.projectZyx);
            this.player1.clickCard(this.bumblebird);
            expect(this.bumblebird.location).toBe('archives');
        });

        it('should end turn after fighting and playing omega', function () {
            this.player1.moveCard(this.duskwitch, 'archives');
            this.player1.fightWith(this.projectZyx, this.lamindra);
            this.player1.clickCard(this.duskwitch);
            this.player1.clickPrompt('Left');
            expect(this.duskwitch.exhausted).toBe(false);
            expect(this.player2).toHavePrompt('Choose which house you want to activate this turn');
            this.player2.clickPrompt('shadows');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
