describe('Ready Messages', function () {
    describe('ready a creature', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['ghoul-keeping'],
                    inPlay: ['helichopper']
                },
                player2: {}
            });
            this.helichopper.exhausted = true;
        });

        it('should log correct message when readying a creature', function () {
            this.player1.play(this.ghoulKeeping);
            this.player1.clickCard(this.helichopper);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Ghoul-keeping',
                "player1 gains an amber due to Ghoul-keeping's bonus icon",
                'player1 uses Ghoul-keeping to ready a friendly Geistoid creature.'
            ]);
        });
    });

    describe('ready phase with entrench', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    inPlay: ['grammy-taps']
                },
                player2: {}
            });
            this.grammyTaps.exhaust();
            this.player1.endTurn();
        });

        it('should log correct message when readying entrenched creatures', function () {
            expect(this.player1).toHavePrompt('Select entrenched creatures to keep exhausted');
            this.player1.clickPrompt('done');
            this.player2.clickPrompt('shadows');
            expect(this.player2).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 readies their cards',
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber ',
                'player2 chooses shadows as their active house this turn'
            ]);
        });

        it('should log correct message when leaving entrenched creatures exhausted', function () {
            expect(this.player1).toHavePrompt('Select entrenched creatures to keep exhausted');
            this.player1.clickCard(this.grammyTaps);
            this.player1.clickPrompt('done');
            this.player2.clickPrompt('shadows');
            expect(this.player2).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player1: 0 amber (0 keys) player2: 0 amber (0 keys)',
                'player2 does not forge a key.  They have 0 amber.  The current cost is 6 amber ',
                'player2 chooses shadows as their active house this turn'
            ]);
        });
    });

    describe('ready and fight with multiple creatures', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['relentless-assault'],
                    inPlay: ['umbra', 'troll', 'ganger-chieftain']
                },
                player2: {
                    inPlay: ['batdrone', 'mother', 'zorg']
                }
            });
        });

        it('should log a ready-and-fight message for each creature', function () {
            this.player1.play(this.relentlessAssault);
            this.player1.clickCard(this.umbra);
            this.player1.clickCard(this.batdrone);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.mother);
            this.player1.clickCard(this.gangerChieftain);
            this.player1.clickCard(this.zorg);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Relentless Assault',
                'player1 uses Relentless Assault to ready and fight with Umbra',
                'player1 uses Umbra to make Umbra fight Batdrone',
                'Batdrone is destroyed',
                'player1 uses Relentless Assault to ready and fight with Troll',
                'player1 uses Troll to make Troll fight Mother',
                'Mother is destroyed',
                'player1 uses Relentless Assault to ready and fight with Ganger Chieftain',
                'player1 uses Ganger Chieftain to make Ganger Chieftain fight Zorg',
                'Ganger Chieftain is destroyed'
            ]);
        });
    });
});
