describe('Yipyax Abductor', function () {
    describe("Yipyax Abductor's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 1,
                    house: 'mars',
                    hand: ['yipyax-abductor', 'jammer-pack', 'wild-spirit', 'came-back-wrong'],
                    inPlay: ['flaxia'],
                    discard: ['containment-field', 'tunk']
                },
                player2: {
                    hand: ['observ-u-max'],
                    inPlay: ['dust-pixie']
                }
            });
        });

        describe('once upgrades are played', function () {
            beforeEach(function () {
                this.player1.playUpgrade(this.jammerPack, this.flaxia);
                this.player1.endTurn();
                this.player2.clickPrompt('staralliance');
                this.player2.playUpgrade(this.observUMax, this.dustPixie);
                this.player2.endTurn();
                this.player1.clickPrompt('mars');
                this.player1.playCreature(this.yipyaxAbductor);
            });

            it('can put an enemy upgrades into archives on play', function () {
                expect(this.player1).toBeAbleToSelect(this.jammerPack);
                expect(this.player1).toBeAbleToSelect(this.observUMax);
                expect(this.player1).not.toBeAbleToSelect(this.containmentField);
                expect(this.player1).not.toBeAbleToSelect(this.wildSpirit);
                expect(this.player1).not.toBeAbleToSelect(this.flaxia);
                expect(this.player1).not.toBeAbleToSelect(this.dustPixie);
                this.player1.clickCard(this.observUMax);
                expect(this.observUMax.location).toBe('archives');
                expect(this.player1.player.archives).toContain(this.observUMax);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            it('can put a friendly upgrade into archives on play', function () {
                this.player1.clickCard(this.jammerPack);
                expect(this.jammerPack.location).toBe('archives');
                expect(this.player1.player.archives).toContain(this.jammerPack);
                expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
            });

            describe('and waiting a turn', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.observUMax);
                    this.player1.endTurn();
                    this.player2.clickPrompt('untamed');
                    this.player2.endTurn();
                    this.player1.clickPrompt('mars');
                });

                it('returns enemy artifact to the owner when taking archives', function () {
                    expect(this.player1).toHavePrompt('Access Archives');
                    this.player1.clickPrompt('Yes');
                    expect(this.observUMax.location).toBe('hand');
                    expect(this.player2.player.hand).toContain(this.observUMax);
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });

                it('can put a friendly artifact into archives on fight', function () {
                    this.player1.clickPrompt('No');
                    this.player1.fightWith(this.yipyaxAbductor, this.dustPixie);
                    this.player1.clickCard(this.jammerPack);
                    expect(this.jammerPack.location).toBe('archives');
                    expect(this.player1.player.archives).toContain(this.jammerPack);
                    expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
                });
            });
        });

        it('can work with actions that become upgrades', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('untamed');
            this.player1.play(this.cameBackWrong);
            this.player1.clickCard(this.tunk);
            this.player1.clickPrompt('Left');
            expect(this.tunk.power).toBe(4);
            this.player1.endTurn();
            this.player2.clickPrompt('untamed');
            this.player2.endTurn();
            this.player1.clickPrompt('mars');
            this.player1.playCreature(this.yipyaxAbductor);
            this.player1.clickCard(this.tunk); // heal tunk
            this.player1.clickCard(this.cameBackWrong);
            expect(this.tunk.power).toBe(6);
            expect(this.player1.player.archives).toContain(this.cameBackWrong);
            expect(this.player1).toHavePrompt('Choose a card to play, discard or use');
        });
    });
});
