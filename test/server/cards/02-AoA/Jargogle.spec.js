describe('Jargogle', function () {
    describe('play ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['helper-bot', 'dharna', 'strange-gizmo'],
                    hand: [
                        'jargogle',
                        'bumblebird',
                        'binding-irons',
                        'deepwood-druid',
                        'duskwitch',
                        'entropic-swirl'
                    ]
                },
                player2: {
                    amber: 4,
                    inPlay: ['shorty']
                }
            });
        });

        it('should select a card to place under Jargogle', function () {
            this.player1.play(this.jargogle);
            expect(this.player1).toBeAbleToSelect(this.bumblebird);
            expect(this.player1).toBeAbleToSelect(this.deepwoodDruid);
            expect(this.player1).toBeAbleToSelect(this.bindingIrons);
            expect(this.player1).not.toBeAbleToSelect(this.jargogle);
            expect(this.player1).not.toBeAbleToSelect(this.dharna);
            expect(this.player1).not.toBeAbleToSelect(this.helperBot);
            expect(this.player1).not.toBeAbleToSelect(this.shorty);
            this.player1.clickCard(this.bindingIrons);
            expect(this.jargogle.childCards).toContain(this.bindingIrons);
        });

        it("should player after destroyed during player's turn", function () {
            this.player1.play(this.jargogle);
            this.player1.clickCard(this.bindingIrons);
            this.jargogle.exhausted = false;
            this.player1.fightWith(this.jargogle, this.shorty);
            expect(this.jargogle.location).toBe('discard');
            expect(this.bindingIrons.location).toBe('discard');
            expect(this.player2.player.chains).toBe(3);
        });

        it('should archive after destroyed by opponent', function () {
            this.player1.play(this.jargogle);
            this.player1.clickCard(this.bindingIrons);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.shorty, this.jargogle);
            expect(this.jargogle.location).toBe('discard');
            expect(this.bindingIrons.location).toBe('archives');
            expect(this.player1.player.archives).toContain(this.bindingIrons);
        });

        it('should play and consider deploy effect of card', function () {
            this.player1.play(this.jargogle);
            this.player1.clickCard(this.deepwoodDruid);
            this.jargogle.exhausted = false;
            this.player1.fightWith(this.jargogle, this.shorty);
            expect(this.player1).toHavePromptButton('Deploy Left');
            expect(this.player1).toHavePromptButton('Deploy Right');
            this.player1.clickPrompt('Deploy Left');
            expect(this.player1).toHavePrompt('Select a card to deploy to the left of');
            this.player1.clickCard(this.dharna); // click to position
            this.player1.clickCard(this.dharna); // click to fully heal Dharna
            expect(this.deepwoodDruid.location).toBe('play area');
            expect(this.deepwoodDruid.neighbors).toContain(this.dharna);
            expect(this.deepwoodDruid.neighbors).toContain(this.helperBot);
            expect(this.jargogle.location).toBe('discard');
        });

        it('should not play and discard alpha card', function () {
            this.player1.play(this.jargogle);
            this.player1.clickCard(this.bumblebird);
            this.jargogle.exhausted = false;
            this.player1.fightWith(this.jargogle, this.shorty);
            expect(this.jargogle.location).toBe('discard');
            expect(this.bumblebird.location).toBe('discard');
        });

        it('should end turn after fighting and playing omega', function () {
            this.player1.play(this.jargogle);
            this.player1.clickCard(this.duskwitch);
            this.jargogle.exhausted = false;
            this.player1.fightWith(this.jargogle, this.shorty);
            this.player1.clickPrompt('Left');
            expect(this.duskwitch.exhausted).toBe(false);
            expect(this.player2).toHavePrompt('Choose which house you want to activate this turn');
            this.player2.clickPrompt('brobnar');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should end turn after destroyed by action and playing omega', function () {
            this.player1.play(this.jargogle);
            this.player1.clickCard(this.duskwitch);
            this.player1.play(this.entropicSwirl);
            this.player1.clickCard(this.jargogle);
            this.player1.clickPrompt('Left');
            expect(this.duskwitch.exhausted).toBe(false);
            expect(this.player2).toHavePrompt('Choose which house you want to activate this turn');
            this.player2.clickPrompt('brobnar');
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should not end turn after playing omega due to Strange Gizmo', function () {
            this.player1.play(this.jargogle);
            this.player1.clickCard(this.duskwitch);
            this.player1.endTurn();
            this.player1.amber = 7;
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.forgeKey('red');
            this.player1.clickPrompt('Left');
            this.player1.clickPrompt('untamed');
            expect(this.jargogle.location).toBe('discard');
            expect(this.duskwitch.location).toBe('play area');
            expect(this.duskwitch.exhausted).toBe(true);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
