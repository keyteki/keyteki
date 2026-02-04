describe('Curse Of Disappearances', function () {
    describe("Curse Of Disappearance's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['curse-of-disappearances'],
                    inPlay: ['brammo']
                },
                player2: {
                    inPlay: ['john-smyth', 'mindwarper']
                }
            });
        });

        describe('when played', function () {
            beforeEach(function () {
                this.player1.play(this.curseOfDisappearances);
                this.player1.endTurn();
                this.player2.clickPrompt('mars');
            });

            it('should enter play under opponents control', function () {
                expect(this.curseOfDisappearances.location).toBe('play area');
                expect(this.player1.player.cardsInPlay).not.toContain(this.curseOfDisappearances);
                expect(this.player2.player.cardsInPlay).toContain(this.curseOfDisappearances);
            });

            describe("at the end of opponent's turn", function () {
                beforeEach(function () {
                    expect(this.johnSmyth.location).toBe('play area');
                    this.player2.endTurn();
                    expect(this.player2).toBeAbleToSelect(this.johnSmyth);
                    expect(this.player2).toBeAbleToSelect(this.mindwarper);
                    expect(this.player2).not.toBeAbleToSelect(this.brammo);
                    expect(this.player2.currentButtons).not.toContain('Done');
                    this.player2.clickCard(this.johnSmyth);
                });

                it("should archive one of opponent's creature", function () {
                    expect(this.johnSmyth.location).toBe('archives');
                    expect(this.player1.player.archives).toContain(this.johnSmyth);
                    expect(this.mindwarper.location).toBe('play area');
                });

                describe('at the end of self turn', function () {
                    it('should not archive friendly creature', function () {
                        this.player1.clickPrompt('mars');
                        this.player1.clickPrompt('No');
                        this.player1.endTurn();
                        expect(this.brammo.location).toBe('play area');
                    });
                });
            });
        });
    });

    describe('Cursse of Disappearances with abduction', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['curse-of-disappearances', 'yzphyz-knowdrone', 'zorg', 'murkens'],
                    inPlay: ['brammo']
                },
                player2: {
                    inPlay: ['john-smyth', 'ember-imp']
                }
            });
            this.player1.makeMaverick(this.murkens, 'mars');
        });

        it('should return creature to owner hand when purged from archives', function () {
            this.player1.play(this.curseOfDisappearances);
            this.player1.endTurn();
            this.player2.clickPrompt('mars');
            this.player2.endTurn();
            // Curse triggers - player2 must archive a creature to player1's archives
            this.player2.clickCard(this.johnSmyth);
            expect(this.johnSmyth.location).toBe('archives');
            expect(this.player1.archives).toContain(this.johnSmyth);
            this.player1.clickPrompt('mars');
            this.player1.clickPrompt('No');
            this.player1.playCreature(this.zorg);
            this.player1.playCreature(this.yzphyzKnowdrone);
            // Yzphyz Knowdrone: Archive a card from hand, then may purge an archived card
            this.player1.clickCard(this.murkens); // Archive murkens from hand
            this.player1.clickCard(this.johnSmyth); // Purge john smyth from archives
            // Abducted card should go to owner's hand instead of being purged
            // Since abduction replaced purge, stun ability doesn't trigger
            expect(this.johnSmyth.location).toBe('hand');
            expect(this.player2.hand).toContain(this.johnSmyth);
            expect(this.player1.archives).not.toContain(this.johnSmyth);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
