describe('Raider', function () {
    describe("Raider's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'unfathomable',
                    amber: 1,
                    hand: ['rustmiser', 'initiation'],
                    inPlay: ['raider:flaxia', 'bubbles'],
                    token: 'raider'
                },
                player2: {
                    amber: 1,
                    inPlay: ['gub', 'krump']
                }
            });
        });

        it('should not give poison to other creature played', function () {
            this.player1.playCreature(this.rustmiser);
            expect(this.rustmiser.hasKeyword('poison')).toBe(false);
            this.player1.endTurn();
        });

        it('should not give poison to other creatures', function () {
            expect(this.bubbles.hasKeyword('poison')).toBe(false);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.bubbles.hasKeyword('poison')).toBe(false);
            this.player1.endTurn();
        });

        it('should gain poison on the owners turn', function () {
            expect(this.raider.hasKeyword('poison')).toBe(true);
            this.player1.fightWith(this.raider, this.krump);
            expect(this.krump.location).toBe('discard');
            this.player1.endTurn();
        });

        it('should gain poison on the owners turn on later turns too', function () {
            expect(this.raider.hasKeyword('poison')).toBe(true);
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.endTurn();
            this.player1.clickPrompt('unfathomable');
            expect(this.raider.hasKeyword('poison')).toBe(true);
            this.player1.endTurn();
        });

        it('should not have poison on the enemy turn', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            expect(this.raider.hasKeyword('poison')).toBe(false);
            this.player2.fightWith(this.krump, this.raider);
            expect(this.krump.location).toBe('play area');
            this.player2.endTurn();
        });

        describe('on the turn played', function () {
            beforeEach(function () {
                this.player1.moveCard(this.rustmiser, 'deck');
                this.newRaider = this.rustmiser;
                this.player1.play(this.initiation);
                this.player1.clickPrompt('Left');
            });

            it('should gain poison', function () {
                expect(this.player1.player.creaturesInPlay.length).toBe(3);
                expect(this.newRaider.hasKeyword('poison')).toBe(true);
                this.player1.endTurn();
            });

            describe('and after destroyed', function () {
                beforeEach(function () {
                    this.player1.endTurn();
                    this.player2.clickPrompt('brobnar');
                    this.player2.fightWith(this.krump, this.newRaider);
                });

                it('should lose poison', function () {
                    expect(this.player1.player.creaturesInPlay.length).toBe(2);
                    expect(this.newRaider.location).toBe('discard');
                    expect(this.newRaider.hasKeyword('poison')).toBe(false);
                    expect(this.newRaider.name).toBe('Rustmiser');
                    this.player2.endTurn();
                });

                describe('and after being played again as original card', function () {
                    beforeEach(function () {
                        this.player2.endTurn();
                        this.player1.moveCard(this.initiation, 'hand');
                        this.player1.moveCard(this.rustmiser, 'hand');
                        this.player1.clickPrompt('unfathomable');
                        this.player1.play(this.rustmiser);
                    });

                    it('should not gain poison', function () {
                        expect(this.player1.player.creaturesInPlay.length).toBe(3);
                        expect(this.rustmiser.location).toBe('play area');
                        expect(this.rustmiser.hasKeyword('poison')).toBe(false);
                        expect(this.rustmiser.name).toBe('Rustmiser');
                        this.player1.endTurn();
                    });
                });
            });
        });
    });
});
