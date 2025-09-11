describe('Expect The Unexpected', function () {
    describe("Expect The Unexpected's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    prophecies: [
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans',
                        'bad-omen'
                    ],
                    hand: [
                        'ancient-bear',
                        'parasitic-arachnoid',
                        'invigorating-shower',
                        'till-the-earth'
                    ],
                    inPlay: ['mushroom-man'],
                    discard: ['witch-of-the-spore']
                },
                player2: {
                    amber: 5,
                    hand: ['spoo-key-charge', 'warfaline', 'lost-in-the-woods', 'witch-of-the-eye'],
                    inPlay: ['haunting-witch', 'umbra'],
                    discard: [
                        'dew-faerie',
                        'dust-pixie',
                        'mimicry',
                        'tantadlin',
                        'snufflegator',
                        'chota-hazri'
                    ]
                }
            });
        });

        it('should trigger when opponent shuffles their discard into their deck on their turn', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.spooKeyCharge);
            expect(this.player2).toBeAbleToSelect(this.hauntingWitch);
            expect(this.player2).toBeAbleToSelect(this.umbra);
            expect(this.player2).not.toBeAbleToSelect(this.mushroomMan);
            this.player2.clickCard(this.umbra);
            expect(this.umbra.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.parasiticArachnoid.location).toBe('discard');
        });

        it('should trigger when opponent shuffles part of their discard into their deck on their turn', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.warfaline);
            this.player2.clickPrompt('Mine');
            expect(this.player2).toBeAbleToSelect(this.hauntingWitch);
            expect(this.player2).toBeAbleToSelect(this.umbra);
            expect(this.player2).not.toBeAbleToSelect(this.mushroomMan);
            this.player2.clickCard(this.umbra);
            expect(this.umbra.amber).toBe(2);
            expect(this.player2.amber).toBe(3);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.parasiticArachnoid.location).toBe('discard');
        });

        it('should not trigger when we shuffle our deck on their turn', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.warfaline);
            this.player2.clickPrompt("Opponent's");
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.parasiticArachnoid.location).toBe('under');
        });

        it('should trigger when opponent shuffles creatures from play into their deck on their turn', function () {
            this.player1.activateProphecy(this.expectTheUnexpected, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.playCreature(this.witchOfTheEye);
            this.player2.play(this.lostInTheWoods);
            this.player2.clickCard(this.umbra);
            this.player2.clickCard(this.hauntingWitch);
            this.player2.clickPrompt('Done');
            this.player2.clickCard(this.mushroomMan);
            this.player2.clickPrompt('Done');
            this.player2.clickCard(this.witchOfTheEye);
            expect(this.witchOfTheEye.amber).toBe(2);
            expect(this.player2.amber).toBe(4);
            expect(this.player2).toHavePrompt('Choose a card to play, discard or use');
            expect(this.parasiticArachnoid.location).toBe('discard');
        });
    });
});
