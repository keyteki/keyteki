describe('Stars Aligned', function () {
    describe("Stars Aligned's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    prophecies: [
                        'stars-aligned',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['ember-imp', 'parasitic-arachnoid'],
                    inPlay: ['charette']
                },
                player2: {
                    amber: 4,
                    inPlay: ['troll']
                }
            });
        });

        it('should fulfill when both players have the same number of creatures at the start of opponent turn', function () {
            this.player1.activateProphecy(this.starsAligned, this.parasiticArachnoid);
            this.player1.endTurn();
            this.player2.clickCard(this.troll);
            expect(this.player2.amber).toBe(2);
            expect(this.troll.amber).toBe(2);
            expect(this.parasiticArachnoid.location).toBe('discard');
            this.player2.clickPrompt('brobnar');
        });

        it('should not fulfill when players have different number of creatures', function () {
            this.player1.activateProphecy(this.starsAligned, this.parasiticArachnoid);
            this.player1.playCreature(this.emberImp);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.parasiticArachnoid.location).toBe('under');
            expect(this.player2).isReadyToTakeAction();
        });

        it('should fulfill when both players have the same number of creatures at the start of player turn', function () {
            this.player1.activateProphecy(this.starsAligned, this.parasiticArachnoid);
            this.player1.playCreature(this.emberImp);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.fightWith(this.troll, this.emberImp);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');
            expect(this.parasiticArachnoid.location).toBe('under');
        });
    });

    describe('Stars Aligned and another start of turn ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ouboros',
                    inPlay: ['noxious-ionox', 'charette']
                },
                player2: {
                    house: 'brobnar',
                    prophecies: [
                        'stars-aligned',
                        'expect-the-unexpected',
                        'forge-ahead-with-confidence',
                        'fate-laughs-at-your-plans'
                    ],
                    hand: ['parasitic-arachnoid'],
                    inPlay: ['troll', 'krump', 'bumpsy']
                }
            });
            this.player1.reap(this.noxiousIonox);
            this.player1.endTurn();
            this.player1.clickCard(this.noxiousIonox);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('brobnar');
            this.player2.activateProphecy(this.starsAligned, this.parasiticArachnoid);
            this.player2.endTurn();
        });

        it('does not fulfill if resolved while creature counts differ', function () {
            expect(this.player1).toHavePrompt('Which ability would you like to use?');
            this.player1.clickPrompt('Stars Aligned');
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            expect(this.parasiticArachnoid.location).toBe('under');
            this.player1.clickPrompt('ouboros');
            expect(this.player1).isReadyToTakeAction();
        });

        it('fulfills if resolved after Noxious Ionox equalizes creature counts', function () {
            this.player1.clickPrompt('Noxious Ionox');
            this.player1.clickCard(this.troll);
            expect(this.troll.location).toBe('discard');
            // Parasitic Arachnoid's fate
            this.player1.clickCard(this.charette);
            expect(this.parasiticArachnoid.location).toBe('discard');
            this.player1.clickPrompt('ouboros');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
