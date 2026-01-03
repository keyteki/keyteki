describe('Professor Scruples', function () {
    describe("Professor Scruples's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['poke', 'timetraveller', 'academy-training', 'rocket-boots'],
                    inPlay: ['professor-scruples', 'dextre'],
                    discard: ['bonerot-venom'],
                    prophecies: [
                        'overreach',
                        'heads-i-win',
                        'trust-your-feelings',
                        'wasteful-regret'
                    ]
                },
                player2: {
                    inPlay: ['krump', 'troll']
                }
            });

            this.player1.playUpgrade(this.academyTraining, this.dextre);
            this.player1.playUpgrade(this.rocketBoots, this.troll);
        });

        it('should discard a card and draw 3 cards when reaping', function () {
            this.player1.reap(this.professorScruples);
            this.player1.clickCard(this.poke);
            expect(this.poke.location).toBe('discard');
            expect(this.player1.hand.length).toBe(4); // 1 remaining + 3 drawn
            this.expectReadyToTakeAction(this.player1);
        });

        it('should purge all upgrades when fate is triggered', function () {
            this.player1.moveCard(this.professorScruples, 'hand');
            this.player1.activateProphecy(this.overreach, this.professorScruples);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.reap(this.krump);
            expect(this.academyTraining.location).toBe('purged');
            expect(this.rocketBoots.location).toBe('purged');
            expect(this.bonerotVenom.location).toBe('discard');
            expect(this.professorScruples.location).toBe('discard');
            this.expectReadyToTakeAction(this.player2);
        });
    });
});
