describe("Kiligog's Trench", function () {
    describe("Kiligog's Trench's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['kiligog-s-trench', 'dust-pixie'],
                    hand: ['duskwitch']
                },
                player2: {
                    inPlay: ['silver-key-imp', 'bronze-key-imp', 'macis-asp', 'dextre']
                }
            });
        });

        describe('when player 1 end round', function () {
            beforeEach(function () {
                this.player1.endTurn();
            });

            it('should destroy each creature with power 1', function () {
                expect(this.kiligogSTrench.tokens.depth).toBe(1);
                expect(this.dustPixie.location).toBe('discard');
                expect(this.silverKeyImp.location).toBe('play area');
                expect(this.bronzeKeyImp.location).toBe('play area');
                expect(this.macisAsp.location).toBe('play area');
                expect(this.dextre.location).toBe('play area');
            });

            describe('when player 2 end round', function () {
                beforeEach(function () {
                    this.player2.clickPrompt('shadows');
                    this.player2.endTurn();
                });

                it('should not destroy any creature power 1', function () {
                    expect(this.kiligogSTrench.tokens.depth).toBe(1);
                    expect(this.silverKeyImp.location).toBe('play area');
                    expect(this.bronzeKeyImp.location).toBe('play area');
                    expect(this.macisAsp.location).toBe('play area');
                    expect(this.dextre.location).toBe('play area');
                });

                describe('when player 1 ends round again', function () {
                    beforeEach(function () {
                        this.player1.clickPrompt('untamed');
                        this.player1.play(this.duskwitch);
                    });

                    it('should destroy each creature with power 2', function () {
                        expect(this.kiligogSTrench.tokens.depth).toBe(2);
                        expect(this.duskwitch.location).toBe('play area');
                        expect(this.silverKeyImp.location).toBe('discard');
                        expect(this.bronzeKeyImp.location).toBe('discard');
                        expect(this.macisAsp.location).toBe('play area');
                        expect(this.dextre.location).toBe('play area');
                    });

                    describe('when player 2 ends round a third time', function () {
                        beforeEach(function () {
                            this.player2.clickPrompt('shadows');
                            this.player2.endTurn();
                            this.player1.clickPrompt('untamed');
                            this.player1.endTurn();
                        });

                        it('should destroy each creature with power 3', function () {
                            expect(this.kiligogSTrench.tokens.depth).toBe(3);
                            expect(this.duskwitch.location).toBe('play area');
                            expect(this.macisAsp.location).toBe('discard');
                            expect(this.dextre.location).toBe('deck');
                        });
                    });
                });
            });
        });
    });
});
