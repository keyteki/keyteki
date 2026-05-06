describe('Damage Messages', function () {
    describe('damage from fight', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['troll']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should log correct message when fighting', function () {
            this.player1.fightWith(this.troll, this.emberImp);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Troll to make Troll fight Ember Imp',
                'Ember Imp is destroyed'
            ]);
        });
    });

    describe('damage from action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    hand: ['punch']
                },
                player2: {
                    inPlay: ['ember-imp']
                }
            });
        });

        it('should log correct message when creature takes damage from action', function () {
            this.player1.play(this.punch);
            this.player1.clickCard(this.emberImp);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Punch',
                "player1 gains an amber due to Punch's bonus icon",
                'player1 uses Punch to deal 3 damage to Ember Imp',
                'Ember Imp is destroyed'
            ]);
        });
    });

    describe('allocated damage', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'shadows',
                    hand: ['colt-sleven'],
                    inPlay: ['urchin']
                },
                player2: {
                    inPlay: ['troll', 'krump']
                }
            });
        });

        it('logs each creature damaged when distributing allocated damage', function () {
            this.urchin.powerCounters = 3;
            this.player1.play(this.coltSleven);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.krump);
            this.player1.clickCard(this.urchin);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Colt Sleven',
                'player1 uses Colt Sleven to deal 1 damage to Troll',
                'player1 uses Colt Sleven to deal 1 damage to Krump',
                'player1 uses Colt Sleven to deal 1 damage to Urchin'
            ]);
        });

        it('aggregates allocations targeting the same creature into one message', function () {
            this.urchin.powerCounters = 3;
            this.player1.play(this.coltSleven);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.troll);
            this.player1.clickCard(this.krump);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Colt Sleven',
                'player1 uses Colt Sleven to deal 2 damage to Troll',
                'player1 uses Colt Sleven to deal 1 damage to Krump'
            ]);
        });
    });
});
