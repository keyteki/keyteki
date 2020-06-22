describe('The Colosseum', function () {
    describe('The Colosseum Functionality', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    amber: 6,
                    house: 'brobnar',
                    inPlay: [
                        'the-colosseum',
                        'firespitter',
                        'bumpsy',
                        'pingle-who-annoys',
                        'krump',
                        'valdr',
                        'ganger-chieftain',
                        'troll',
                        'foozle'
                    ]
                },
                player2: {
                    amber: 6,
                    hand: ['ghostly-hand'],
                    inPlay: [
                        'nexus',
                        'bad-penny',
                        'silvertooth',
                        'ronnie-wristclocks',
                        'murkens',
                        'lamindra',
                        'umbra',
                        'redlock'
                    ]
                }
            });
            this.player1.player.optionSettings.orderForcedAbilities = false;
        });

        it('should place a glory counter on itself when an enemy creature is destroyed [1]', function () {
            this.player1.fightWith(this.bumpsy, this.badPenny);
            expect(this.theColosseum.tokens.glory).toBe(1);
        });

        it('should place a glory counter on itself when an enemy creature is destroyed [2]', function () {
            this.player1.fightWith(this.bumpsy, this.badPenny);
            this.player1.fightWith(this.firespitter, this.silvertooth);
            expect(this.theColosseum.tokens.glory).toBe(2);
        });

        it('should place a glory counter on itself when an enemy creature is destroyed [3]', function () {
            this.player1.fightWith(this.bumpsy, this.badPenny);
            this.player1.fightWith(this.firespitter, this.silvertooth);
            this.player1.fightWith(this.krump, this.ronnieWristclocks);
            expect(this.theColosseum.tokens.glory).toBe(3);
        });

        it('should place a glory counter on itself when an enemy creature is destroyed [4]', function () {
            this.player1.fightWith(this.bumpsy, this.badPenny);
            this.player1.fightWith(this.valdr, this.silvertooth);
            this.player1.fightWith(this.krump, this.ronnieWristclocks);
            this.player1.fightWith(this.gangerChieftain, this.lamindra);
            this.player1.fightWith(this.troll, this.lamindra);
            expect(this.theColosseum.tokens.glory).toBe(4);
        });

        it('should place a glory counter on itself when an enemy creature is destroyed [5]', function () {
            this.player1.fightWith(this.bumpsy, this.badPenny);
            this.player1.fightWith(this.valdr, this.silvertooth);
            this.player1.fightWith(this.krump, this.ronnieWristclocks);
            this.player1.fightWith(this.gangerChieftain, this.lamindra);
            this.player1.fightWith(this.troll, this.lamindra);
            this.player1.fightWith(this.firespitter, this.murkens);
            expect(this.theColosseum.tokens.glory).toBe(5);
        });

        it('should place a glory counter on itself when an enemy creature is destroyed [6]', function () {
            this.player1.fightWith(this.bumpsy, this.badPenny);
            this.player1.fightWith(this.valdr, this.silvertooth);
            this.player1.fightWith(this.krump, this.ronnieWristclocks);
            this.player1.fightWith(this.gangerChieftain, this.lamindra);
            this.player1.fightWith(this.troll, this.lamindra);
            this.player1.fightWith(this.firespitter, this.murkens);
            this.player1.fightWith(this.pingleWhoAnnoys, this.umbra);
            expect(this.theColosseum.tokens.glory).toBe(6);
        });

        it('should not place a glory counter on itself when a friendly creature is destroyed', function () {
            this.player1.fightWith(this.pingleWhoAnnoys, this.redlock);
            expect(this.theColosseum.tokens.glory).toBe(undefined);
        });

        it('should remove 6 glory counters from itself when used [0], and forge at current cost', function () {
            this.player1.fightWith(this.bumpsy, this.badPenny);
            this.player1.fightWith(this.valdr, this.silvertooth);
            this.player1.fightWith(this.krump, this.ronnieWristclocks);
            this.player1.fightWith(this.gangerChieftain, this.lamindra);
            this.player1.fightWith(this.troll, this.lamindra);
            this.player1.fightWith(this.firespitter, this.murkens);
            this.player1.fightWith(this.pingleWhoAnnoys, this.umbra);
            expect(this.theColosseum.tokens.glory).toBe(6);
            this.player1.clickCard(this.theColosseum);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(0);
            expect(this.theColosseum.tokens.glory).toBe(undefined);
        });

        it('should remove 6 glory counters from itself when used [1], and forge at current cost', function () {
            this.player1.fightWith(this.bumpsy, this.badPenny);
            this.player1.fightWith(this.valdr, this.silvertooth);
            this.player1.fightWith(this.krump, this.ronnieWristclocks);
            this.player1.fightWith(this.gangerChieftain, this.lamindra);
            this.player1.fightWith(this.troll, this.lamindra);
            this.player1.fightWith(this.firespitter, this.murkens);
            this.player1.fightWith(this.pingleWhoAnnoys, this.umbra);
            this.player1.fightWith(this.foozle, this.redlock);
            expect(this.theColosseum.tokens.glory).toBe(7);
            this.player1.clickCard(this.theColosseum);
            this.player1.clickPrompt("Use this card's Omni ability");
            this.player1.forgeKey('Red');
            expect(this.player1.player.keys.red).toBe(true);
            expect(this.player1.amber).toBe(0);
            expect(this.theColosseum.tokens.glory).toBe(1);
        });

        it('should remove 6 glory counters from itself when used [1], and fizzle if not enough amber to forge', function () {
            this.player1.amber = 4;
            this.player1.fightWith(this.bumpsy, this.badPenny);
            this.player1.fightWith(this.valdr, this.silvertooth);
            this.player1.fightWith(this.krump, this.ronnieWristclocks);
            this.player1.fightWith(this.gangerChieftain, this.lamindra);
            this.player1.fightWith(this.troll, this.lamindra);
            this.player1.fightWith(this.firespitter, this.murkens);
            this.player1.fightWith(this.pingleWhoAnnoys, this.umbra);
            this.player1.fightWith(this.foozle, this.redlock);
            expect(this.theColosseum.tokens.glory).toBe(7);
            this.player1.clickCard(this.theColosseum);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.player1.amber).toBe(4);
            expect(this.theColosseum.tokens.glory).toBe(1);
        });

        it('should do nothing if there are less than 6 glory counters on itself when used', function () {
            this.player1.amber = 4;
            this.player1.fightWith(this.bumpsy, this.badPenny);
            this.player1.fightWith(this.valdr, this.silvertooth);
            expect(this.theColosseum.tokens.glory).toBe(2);
            this.player1.clickCard(this.theColosseum);
            this.player1.clickPrompt("Use this card's Omni ability");
            expect(this.player1.amber).toBe(4);
            expect(this.theColosseum.tokens.glory).toBe(2);
        });
    });
});
