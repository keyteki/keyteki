describe('Prospector', function () {
    describe('when entering play,', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'ekwidon',
                    amber: 1,
                    token: 'prospector',
                    hand: ['hire-on', 'faust-the-great'],
                    inPlay: ['flaxia', 'the-old-tinker']
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });

            this.prospector = this.faustTheGreat;
            this.player1.moveCard(this.faustTheGreat, 'deck');
            this.player1.play(this.hireOn);
        });

        it('should show correct prompt title', function () {
            expect(this.prospector.id).toBe('faust-the-great');
            expect(this.prospector.name).toBe('Prospector');
            expect(this.player1).toHavePrompt('Prospector');
            expect(this.player1).toHavePrompt('Which flank do you want to place this creature on?');
            expect(this.player1).toHavePromptButton('Left');
            expect(this.player1).toHavePromptButton('Right');
        });

        describe('when destroyed,', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Right');
                this.prospector.exhausted = false;
                this.initialCards = this.player1.hand.length;
                this.player1.fightWith(this.prospector, this.krump);
            });

            it('should draw a card', function () {
                expect(this.krump.location).toBe('play area');
                expect(this.prospector.location).toBe('discard');
                expect(this.player1.hand.length).toBe(this.initialCards + 1);
            });

            describe('when back to hand,', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('brobnar');
                    this.player2.endTurn();
                    this.player1.clickPrompt('saurian');
                    this.player1.moveCard(this.faustTheGreat, 'hand');
                });

                it('should be Faust', function () {
                    expect(this.faustTheGreat.name).toBe('Faust the Great');
                });

                describe('when played as Faust,', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.faustTheGreat);
                        this.player1.clickPrompt('Play this creature');
                    });

                    it('should show correct prompt title', function () {
                        expect(this.faustTheGreat.id).toBe('faust-the-great');
                        expect(this.faustTheGreat.name).toBe('Faust the Great');
                        expect(this.player1).toHavePrompt('Faust the Great');
                        expect(this.player1).toHavePrompt(
                            'Which flank do you want to place this creature on?'
                        );
                        expect(this.player1).toHavePromptButton('Left');
                        expect(this.player1).toHavePromptButton('Right');
                    });

                    it('should increase key cost', function () {
                        expect(this.player2.player.getCurrentKeyCost()).toBe(6);
                        this.player1.clickPrompt('Right');
                        this.player1.clickCard(this.faustTheGreat);
                        expect(this.player2.player.getCurrentKeyCost()).toBe(7);
                    });

                    describe('when destroyed,', function () {
                        beforeEach(function () {
                            this.player1.clickPrompt('Right');
                            this.player1.clickCard(this.faustTheGreat);
                            this.faustTheGreat.exhausted = false;
                            this.initialCards = this.player1.hand.length;
                            this.player1.fightWith(this.faustTheGreat, this.krump);
                        });

                        it('should not draw a card', function () {
                            expect(this.krump.location).toBe('play area');
                            expect(this.faustTheGreat.location).toBe('discard');
                            expect(this.player1.hand.length).toBe(this.initialCards);
                        });
                    });
                });
            });
        });
    });
});
