describe('Ozmo Martianologist', function () {
    describe("Ozmo Martianologist's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['ozmo-martianologist']
                },
                player2: {
                    amber: 2,
                    inPlay: ['troll', 'lamindra']
                }
            });
        });

        it('after reap should not show any prompt when there are not mars in play', function () {
            this.player1.reap(this.ozmoMartianologist);
            expect(this.player1).isReadyToTakeAction();
        });

        it('after fight should not show any prompt when there are not mars in play', function () {
            this.player1.fightWith(this.ozmoMartianologist, this.lamindra);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Ozmo Martianologist', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    inPlay: ['ozmo-martianologist', 'zorg']
                },
                player2: {
                    amber: 2,
                    inPlay: ['dextre', 'ether-spider', 'tunk', 'lamindra']
                }
            });

            this.zorg.tokens.damage = 4;
            this.etherSpider.tokens.damage = 4;
        });

        describe('after reap', function () {
            beforeEach(function () {
                this.player1.reap(this.ozmoMartianologist);
            });

            it('should allow healing or stunning a mars creature', function () {
                expect(this.player1).toHavePrompt('Select one');
                expect(this.player1).toHavePromptButton('Heal a Mars creature');
                expect(this.player1).toHavePromptButton('Stun a Mars creature');
            });

            describe('when heal is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Heal a Mars creature');
                });

                it('should prompt for any mars creature', function () {
                    expect(this.player1).toBeAbleToSelect(this.zorg);
                    expect(this.player1).toBeAbleToSelect(this.etherSpider);
                    expect(this.player1).toBeAbleToSelect(this.tunk);
                    expect(this.player1).not.toBeAbleToSelect(this.ozmoMartianologist);
                    expect(this.player1).not.toBeAbleToSelect(this.dextre);
                    expect(this.player1).not.toBeAbleToSelect(this.lamindra);
                });

                describe('and a mars creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.zorg);
                    });

                    it('should heal 3 damage', function () {
                        expect(this.zorg.damage).toBe(1);
                        expect(this.etherSpider.damage).toBe(4);
                    });
                });
            });

            describe('when stun is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Stun a Mars creature');
                });

                it('should prompt for any mars creature', function () {
                    expect(this.player1).toBeAbleToSelect(this.zorg);
                    expect(this.player1).toBeAbleToSelect(this.etherSpider);
                    expect(this.player1).toBeAbleToSelect(this.tunk);
                    expect(this.player1).not.toBeAbleToSelect(this.ozmoMartianologist);
                    expect(this.player1).not.toBeAbleToSelect(this.dextre);
                });

                describe('and a mars creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.tunk);
                    });

                    it('should stun', function () {
                        expect(this.zorg.stunned).toBe(false);
                        expect(this.etherSpider.stunned).toBe(false);
                        expect(this.tunk.stunned).toBe(true);
                    });
                });
            });
        });

        describe('after fight', function () {
            beforeEach(function () {
                this.player1.fightWith(this.ozmoMartianologist, this.lamindra);
            });

            it('should allow healing or stunning a mars creature', function () {
                expect(this.player1).toHavePrompt('Select one');
                expect(this.player1).toHavePromptButton('Heal a Mars creature');
                expect(this.player1).toHavePromptButton('Stun a Mars creature');
            });

            describe('when heal is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Heal a Mars creature');
                });

                it('should prompt for any mars creature', function () {
                    expect(this.player1).toBeAbleToSelect(this.zorg);
                    expect(this.player1).toBeAbleToSelect(this.etherSpider);
                    expect(this.player1).toBeAbleToSelect(this.tunk);
                    expect(this.player1).not.toBeAbleToSelect(this.ozmoMartianologist);
                    expect(this.player1).not.toBeAbleToSelect(this.dextre);
                });

                describe('and a mars creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.zorg);
                    });

                    it('should heal 3 damage', function () {
                        expect(this.zorg.damage).toBe(1);
                        expect(this.etherSpider.damage).toBe(4);
                    });
                });
            });

            describe('when stun is selected', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Stun a Mars creature');
                });

                it('should prompt for any mars creature', function () {
                    expect(this.player1).toBeAbleToSelect(this.zorg);
                    expect(this.player1).toBeAbleToSelect(this.etherSpider);
                    expect(this.player1).toBeAbleToSelect(this.tunk);
                    expect(this.player1).not.toBeAbleToSelect(this.ozmoMartianologist);
                    expect(this.player1).not.toBeAbleToSelect(this.dextre);
                });

                describe('and a mars creature is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.tunk);
                    });

                    it('should stun', function () {
                        expect(this.zorg.stunned).toBe(false);
                        expect(this.etherSpider.stunned).toBe(false);
                        expect(this.tunk.stunned).toBe(true);
                    });
                });
            });
        });
    });
});
