describe('Discard Messages', function () {
    describe('discard card', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['mindwarper']
                },
                player2: {}
            });
        });

        it('should log correct message when using discarding a card from hand', function () {
            this.player1.scrap(this.mindwarper);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe(['player1 discards Mindwarper']);
        });
    });

    describe('discard card with ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['troll'],
                    inPlay: ['feeding-pit']
                },
                player2: {}
            });
        });

        it('should log correct message when discarding a card using an ability', function () {
            this.player1.useAction(this.feedingPit);
            this.player1.clickCard(this.troll);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Feeding Pit',
                'player1 uses Feeding Pit to discard Troll'
            ]);
        });
    });

    describe('scrap ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'mars',
                    hand: ['donor-vox'],
                    inPlay: ['zorg']
                },
                player2: {}
            });
        });

        it('should log correct message when using scrap ability', function () {
            this.player1.scrap(this.donorVox);
            this.player1.clickCard(this.zorg);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 discards Donor Vox',
                'player1 uses Donor Vox to give Zorg two +1 power counters'
            ]);
        });
    });

    describe('random discard from opponent', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['mind-barb']
                },
                player2: {
                    hand: ['troll']
                }
            });
        });

        it('should log correct message when discarding opponent card at random', function () {
            this.player1.play(this.mindBarb);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Mind Barb',
                "player1 uses Mind Barb's amber bonus icon to gain 1 amber",
                "player1 uses Mind Barb to randomly discard 1 card from player2's hand",
                'player2 randomly discards Troll from hand'
            ]);
        });
    });

    describe('random discard from both players', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['trihard', 'ember-imp', 'mother', 'dextre']
                },
                player2: {
                    hand: ['troll', 'charette', 'krump']
                }
            });
        });

        it('should log correct messages when both players discard at random', function () {
            this.player1.playCreature(this.trihard);
            this.player1.clickPrompt('Me');
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Trihard',
                "player1 uses Trihard to randomly discard 1 card from player1's hand",
                `player1 randomly discards ${this.player1.discard[0].name} from hand`,
                "player1 uses Trihard to randomly discard 1 card from player2's hand",
                `player2 randomly discards ${this.player2.discard[0].name} from hand`
            ]);
        });
    });

    describe('random discard multiple cards from both players', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: [
                        'trihard',
                        'ember-imp',
                        'mind-barb',
                        'tocsin',
                        'charette',
                        'shooler',
                        'pit-demon'
                    ]
                },
                player2: {
                    hand: [
                        'troll',
                        'krump',
                        'anger',
                        'punch',
                        'tremor',
                        'pelf',
                        'gauntlet-of-command',
                        'iron-obelisk',
                        'smaaash'
                    ]
                }
            });
        });

        it('should log correct messages when both players discard multiple cards at random', function () {
            // Player1: 6 cards after playing trihard, 6/3=2 discards
            // Player2: 9 cards, 9/3=3 discards
            this.player1.playCreature(this.trihard);
            this.player1.clickPrompt('Me');
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Trihard',
                "player1 uses Trihard to randomly discard 2 cards from player1's hand",
                `player1 randomly discards ${this.player1.discard[1].name} from hand`,
                `player1 randomly discards ${this.player1.discard[0].name} from hand`,
                "player1 uses Trihard to randomly discard 3 cards from player2's hand",
                `player2 randomly discards ${this.player2.discard[2].name} from hand`,
                `player2 randomly discards ${this.player2.discard[1].name} from hand`,
                `player2 randomly discards ${this.player2.discard[0].name} from hand`
            ]);
        });
    });

    describe('random discard from archives', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    inPlay: ['tantadlin']
                },
                player2: {
                    inPlay: ['troll'],
                    archives: ['anger']
                }
            });
        });

        it('should log correct message when discarding from archives', function () {
            this.player1.fightWith(this.tantadlin, this.troll);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Tantadlin to make Tantadlin fight Troll',
                "player1 uses Tantadlin to randomly discard 1 card from player2's archives",
                'player2 randomly discards Anger from archives'
            ]);
        });
    });

    describe('discard entire hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['punctuated-equilibrium', 'dust-pixie', 'flaxia']
                },
                player2: {
                    hand: ['troll', 'anger']
                }
            });
        });

        it('should log correct messages when discarding entire hands', function () {
            this.player1.play(this.punctuatedEquilibrium);
            expect(this.player1).toHavePrompt('Choose which player discards first');
            this.player1.clickPrompt('Me');
            expect(this.player1).toHavePrompt('Select a card to discard');
            this.player1.clickCard(this.dustPixie);
            this.player1.clickCard(this.flaxia);
            expect(this.player1).isReadyToTakeAction();
            // Opponent discards randomly
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Punctuated Equilibrium',
                'player1 uses Punctuated Equilibrium to make each player discard their hand and then refill their hands',
                'player1 discards Dust Pixie from hand',
                'player1 discards Flaxia from hand',
                `player2 randomly discards ${this.player2.discard[1].name} from hand`,
                `player2 randomly discards ${this.player2.discard[0].name} from hand`,
                'player1 draws 6 cards to refill their hand to 6 cards',
                'player2 draws 6 cards to refill their hand to 6 cards'
            ]);
        });
    });

    describe('discard bonus icons', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['anomaly-exploiter', 'dextre', 'batdrone', 'brillix-ponder']
                },
                player2: {}
            });
        });

        it('should log correct message when discarding 1 card', function () {
            this.anomalyExploiter.enhancements = ['discard'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickCard(this.dextre);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Anomaly Exploiter's discard bonus icon to discard Dextre"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should log correct message when discarding 2 cards', function () {
            this.anomalyExploiter.enhancements = ['discard', 'discard'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickCard(this.dextre);
            this.player1.clickCard(this.batdrone);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Anomaly Exploiter's discard bonus icon to discard Dextre",
                "player1 uses Anomaly Exploiter's discard bonus icon to discard Batdrone"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should log correct message in bonus icon order', function () {
            this.anomalyExploiter.enhancements = ['logos', 'discard', 'amber', 'discard'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickCard(this.dextre);
            this.player1.clickCard(this.batdrone);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Anomaly Exploiter's discard bonus icon to discard Dextre",
                "player1 uses Anomaly Exploiter's amber bonus icon to gain 1 amber",
                "player1 uses Anomaly Exploiter's discard bonus icon to discard Batdrone"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });

        it('should log correct message when discarding triggers scrap ability', function () {
            this.anomalyExploiter.enhancements = ['discard'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickCard(this.brillixPonder);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Anomaly Exploiter's discard bonus icon to discard Brillix Ponder",
                'player1 uses Brillix Ponder to draw 1 card',
                'player1 draws 1 card'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('amphora captura replacing discard bonus icon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['anomaly-exploiter', 'dextre'],
                    inPlay: ['amphora-captura', 'batdrone']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should log correct message when discard bonus icon is replaced with capture', function () {
            this.anomalyExploiter.enhancements = ['discard'];
            this.player1.play(this.anomalyExploiter);
            this.player1.clickPrompt('capture');
            this.player1.clickCard(this.batdrone);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Anomaly Exploiter',
                "player1 uses Amphora Captura to resolve Anomaly Exploiter's discard bonus icon as a capture bonus icon",
                "player1 uses Anomaly Exploiter's capture bonus icon to capture 1 amber onto Batdrone"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('discard hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['infernal-terran', 'ember-imp', 'shooler']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should log correct message when discarding hand', function () {
            this.player1.scrap(this.infernalTerran);
            this.player1.clickCard(this.emberImp);
            this.player1.clickCard(this.shooler);
            expect(this).toHaveAllChatMessagesBe([
                'player1 discards Infernal Terran',
                "player1 uses Infernal Terran to discard player1's hand",
                'player1 discards Ember Imp from hand',
                'player1 discards Shooler from hand'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('discard hand with scrap draw', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['infernal-terran', 'brillix-ponder']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should log correct message when discarding hand triggers scrap ability', function () {
            this.player1.scrap(this.infernalTerran);
            this.player1.clickCard(this.brillixPonder);
            expect(this).toHaveAllChatMessagesBe([
                'player1 discards Infernal Terran',
                "player1 uses Infernal Terran to discard player1's hand",
                'player1 discards Brillix Ponder from hand',
                'player1 uses Brillix Ponder to draw 1 card',
                'player1 draws 1 card',
                'player1 discards Hand of Dis from hand'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
