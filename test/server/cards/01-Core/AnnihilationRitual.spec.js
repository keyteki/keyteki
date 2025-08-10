describe('Annihilation Ritual', function () {
    describe("Annihilation Ritual's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    inPlay: ['annihilation-ritual', 'ember-imp', 'guardian-demon', 'the-terror'],
                    hand: ['hand-of-dis', 'pitlord']
                },
                player2: {
                    token: 'grumpus',
                    inPlay: [
                        'mighty-tiger',
                        'snufflegator',
                        'inka-the-spider',
                        'grumpus:lost-in-the-woods',
                        'brammo'
                    ],
                    hand: ['niffle-kong', 'niffle-kong2', 'ancient-bear']
                }
            });
        });

        it('should purge its controllers creatures', function () {
            this.player1.play(this.handOfDis);
            expect(this.player1).toHavePrompt('Hand of Dis');
            this.player1.clickCard(this.guardianDemon);
            expect(this.guardianDemon.location).toBe('purged');
        });

        it("should purge opponent's creatures", function () {
            this.player1.play(this.handOfDis);
            expect(this.player1).toHavePrompt('Hand of Dis');
            this.player1.clickCard(this.snufflegator);
            expect(this.snufflegator.location).toBe('purged');
        });

        it('should not purge discarded creatures', function () {
            this.player1.clickCard(this.pitlord);
            this.player1.clickPrompt('Discard this card');
            expect(this.pitlord.location).toBe('discard');
        });

        it('should purge both parts of a gigantic creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.niffleKong);
            this.player2.clickPrompt('Done');
            this.player2.play(this.ancientBear);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');

            this.player1.play(this.handOfDis);
            expect(this.player1).toHavePrompt('Hand of Dis');
            this.player1.clickCard(this.niffleKong);
            expect(this.niffleKong.location).toBe('purged');
            expect(this.niffleKong2.location).toBe('purged');
        });

        it('should purge both parts of a gigantic creature', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.play(this.niffleKong);
            this.player2.clickPrompt('Done');
            this.player2.play(this.ancientBear);
            this.player2.endTurn();
            this.player1.clickPrompt('dis');

            this.player1.play(this.handOfDis);
            expect(this.player1).toHavePrompt('Hand of Dis');
            this.player1.clickCard(this.niffleKong);
            expect(this.niffleKong.location).toBe('purged');
            expect(this.niffleKong2.location).toBe('purged');
        });

        it('should purge token creatures', function () {
            this.player1.play(this.handOfDis);
            expect(this.player1).toHavePrompt('Hand of Dis');
            this.player1.clickCard(this.grumpus);
            expect(this.grumpus.location).toBe('purged');
        });
    });
});
