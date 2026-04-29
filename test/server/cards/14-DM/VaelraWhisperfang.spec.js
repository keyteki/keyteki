describe('Vaelra Whisperfang', function () {
    describe("Vaelra Whisperfang's ability", function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['urchin'],
                    inPlay: ['vaelra-whisperfang']
                },
                player2: {
                    hand: ['troll', 'lamindra']
                }
            });
        });

        it('deals 2 damage to a creature played by the opponent', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('brobnar');
            this.player2.play(this.troll);
            expect(this.troll.damage).toBe(2);
            expect(this.player2).isReadyToTakeAction();
        });

        it('destroys a low-power enemy creature when played', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('shadows');
            this.player2.play(this.lamindra);
            expect(this.lamindra.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('does not damage friendly creatures when played', function () {
            this.player1.play(this.urchin);
            expect(this.urchin.damage).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('Vaelra Whisperfang vs treachery', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['vaelra-whisperfang']
                },
                player2: {
                    house: 'redemption',
                    hand: ['ragatha']
                }
            });
        });

        it('damages a treachery creature played by opponent (which enters under controller)', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('redemption');
            this.player2.play(this.ragatha);
            expect(this.ragatha.controller).toBe(this.player1.player);
            expect(this.ragatha.damage).toBe(2);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('Vaelra Whisperfang vs Talent Scout', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['vaelra-whisperfang'],
                    hand: ['troll']
                },
                player2: {
                    house: 'ekwidon',
                    hand: ['talent-scout']
                }
            });
        });

        it("triggers in player-chosen order; Talent Scout first plays the opponent's creature then Vaelra hits Talent Scout (now opponent's)", function () {
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.play(this.talentScout);
            this.player2.clickCard(this.talentScout);
            this.player2.clickCard(this.troll);
            this.player2.clickPrompt('Left');
            expect(this.troll.location).toBe('play area');
            expect(this.troll.damage).toBe(2);
            expect(this.talentScout.location).toBe('discard');
            expect(this.player2).isReadyToTakeAction();
        });

        it('player2 may resolve Vaelra first, killing Talent Scout before its play effect', function () {
            this.player1.endTurn();
            this.player2.clickPrompt('ekwidon');
            this.player2.play(this.talentScout);
            this.player2.clickCard(this.vaelraWhisperfang);
            expect(this.talentScout.location).toBe('discard');
            expect(this.troll.location).toBe('hand');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
