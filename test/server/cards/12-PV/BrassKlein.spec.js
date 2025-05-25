describe('Brass Klein', function () {
    describe("Brass Klein's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 2,
                    house: 'redemption',
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ],
                    hand: ['brass-klein', 'ruthless-avenger'],
                    inPlay: ['ember-imp']
                },
                player2: {
                    amber: 4,
                    inPlay: ['flaxia', 'snufflegator']
                }
            });
        });

        it('should gain skirmish while on a flank', function () {
            this.player1.playCreature(this.brassKlein);
            expect(this.brassKlein.hasKeyword('skirmish')).toBe(true);
            expect(this.brassKlein.hasKeyword('taunt')).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should gain taunt while not on a flank', function () {
            this.player1.playCreature(this.brassKlein);
            this.player1.playCreature(this.ruthlessAvenger);
            expect(this.brassKlein.hasKeyword('taunt')).toBe(true);
            expect(this.brassKlein.hasKeyword('skirmish')).toBe(false);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });

        it('should prevent friendly creatures from fighting when fate is triggered', function () {
            this.player1.activateProphecy(this.overreach, this.brassKlein);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.reap(this.flaxia);
            this.player2.clickCard(this.snufflegator);
            expect(this.player2).toHavePromptButton('Reap with this creature');
            expect(this.player2).not.toHavePromptButton('Fight with this creature');
            expect(this.player2).toHavePromptButton('Cancel');
        });
    });
});
