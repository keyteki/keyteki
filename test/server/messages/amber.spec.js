describe('Amber Messages', function () {
    describe('gain amber from reap', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'brobnar',
                    inPlay: ['ganger-chieftain']
                },
                player2: {}
            });
        });

        it('should log correct message when reaping for amber', function () {
            this.player1.reap(this.gangerChieftain);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Ganger Chieftain to reap with Ganger Chieftain'
            ]);
        });
    });

    describe('gain amber from bonus icon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['dust-pixie']
                },
                player2: {}
            });
        });

        it('should log correct message when gaining amber from bonus icon', function () {
            this.player1.play(this.dustPixie);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Dust Pixie',
                "player1 uses Dust Pixie's amber bonus icon to gain 1 amber",
                "player1 uses Dust Pixie's amber bonus icon to gain 1 amber"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('amphora captura replacing amber bonus icon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['dust-pixie'],
                    inPlay: ['amphora-captura', 'ancient-bear']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should log correct message when amber bonus icon is replaced with capture', function () {
            this.player1.play(this.dustPixie);
            this.player1.clickPrompt('capture');
            this.player1.clickCard(this.ancientBear);
            this.player1.clickPrompt('capture');
            this.player1.clickCard(this.ancientBear);
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Dust Pixie',
                "player1 uses Amphora Captura to resolve Dust Pixie's amber bonus icon as a capture bonus icon",
                "player1 uses Dust Pixie's capture bonus icon to capture 1 amber onto Ancient Bear",
                "player1 uses Amphora Captura to resolve Dust Pixie's amber bonus icon as a capture bonus icon",
                "player1 uses Dust Pixie's capture bonus icon to capture 1 amber onto Ancient Bear"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('whimsical conjuror replacing amber bonus icon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    token: 'niffle-brute',
                    hand: ['dust-pixie'],
                    inPlay: ['whimsical-conjuror']
                },
                player2: {}
            });
        });

        it('should log correct message when amber bonus icon is replaced with token creature', function () {
            this.player1.play(this.dustPixie);
            this.player1.clickPrompt('Token Creature');
            this.player1.clickPrompt('Right');
            this.player1.clickPrompt('Amber');
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Dust Pixie',
                "player1 uses Whimsical Conjuror to resolve Dust Pixie's amber bonus icon to make a token creature",
                'player1 puts Niffle Brute into play',
                "player1 uses Dust Pixie's amber bonus icon to gain 1 amber"
            ]);
        });
    });

    describe('gain amber from card ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'untamed',
                    hand: ['dust-pixie'],
                    inPlay: ['hunting-witch']
                },
                player2: {}
            });
        });

        it('should log correct message when gaining amber from card ability', function () {
            this.player1.play(this.dustPixie);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Dust Pixie',
                "player1 uses Dust Pixie's amber bonus icon to gain 1 amber",
                "player1 uses Dust Pixie's amber bonus icon to gain 1 amber",
                'player1 uses Hunting Witch to gain 1 amber'
            ]);
        });
    });

    describe('manifestation resolving all bonus icons', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'geistoid',
                    hand: ['manifestation', 'batdrone'],
                    inPlay: ['echofly'],
                    discard: new Array(10).fill('poke').concat(['control-the-weak'])
                },
                player2: {
                    amber: 3,
                    inPlay: ['lamindra']
                }
            });

            this.controlTheWeak.enhancements = ['amber', 'capture', 'damage', 'draw', 'discard'];
        });

        it('should log correct message when manifestation resolves all bonus icons', function () {
            this.player1.play(this.manifestation);
            this.player1.clickCard(this.controlTheWeak);
            this.player1.clickCard(this.echofly); // capture target
            this.player1.clickCard(this.lamindra); // damage target
            this.player1.clickCard(this.batdrone); // discard target
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Manifestation',
                "player1 uses Manifestation's amber bonus icon to gain 1 amber",
                "player1 uses Manifestation to resolve Control the Weak's bonus icons",
                "player1 uses Control the Weak's amber bonus icon to gain 1 amber",
                "player1 uses Control the Weak's amber bonus icon to gain 1 amber",
                "player1 uses Control the Weak's capture bonus icon to capture 1 amber onto Echofly",
                "player1 uses Control the Weak's damage bonus icon to deal 1 damage to Lamindra",
                'Lamindra is destroyed',
                "player1 uses Control the Weak's draw bonus icon to draw a card",
                "player1 uses Control the Weak's discard bonus icon to discard Batdrone"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('lose amber', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'dis',
                    hand: ['rotgrub']
                },
                player2: {
                    amber: 2
                }
            });
        });

        it('should log correct message when opponent loses amber', function () {
            this.player1.play(this.rotgrub);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 plays Rotgrub',
                'player1 uses Rotgrub to make player2 lose 1 amber'
            ]);
        });
    });

    describe('transfer amber', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    amber: 2,
                    inPlay: ['dextre']
                },
                player2: {
                    inPlay: ['cap-reigns']
                }
            });
        });

        it('should log correct message when transferring amber', function () {
            this.player1.reap(this.dextre);
            expect(this.player1).isReadyToTakeAction();
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Dextre to reap with Dextre',
                'player1 uses Dextre to transfer 1 amber from player1'
            ]);
        });
    });

    describe('master of the grey blocking bonus icons', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['neuro-syphon']
                },
                player2: {
                    inPlay: ['master-of-the-grey']
                }
            });
        });

        it('should log no bonus icon message when blocked by master of the grey', function () {
            this.player1.play(this.neuroSyphon);
            expect(this).toHaveAllChatMessagesBe(['player1 plays Neuro Syphon']);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('master of the grey blocking fission bloom', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['neuro-syphon'],
                    inPlay: ['fission-bloom']
                },
                player2: {
                    inPlay: ['master-of-the-grey']
                }
            });
        });

        it('should log fission bloom activation but no bonus icon messages when blocked', function () {
            this.player1.useAction(this.fissionBloom);
            this.player1.play(this.neuroSyphon);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Fission Bloom to resolve the bonus icons of the next card played an additional time',
                'player1 plays Neuro Syphon',
                'player1 uses Fission Bloom to resolve the bonus icons of Neuro Syphon an additional time'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('fission bloom doubling bonus icons', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['neuro-syphon'],
                    inPlay: ['fission-bloom']
                },
                player2: {}
            });
        });

        it('should log correct message when fission bloom doubles bonus icons', function () {
            this.player1.useAction(this.fissionBloom);
            this.player1.play(this.neuroSyphon);
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Fission Bloom to resolve the bonus icons of the next card played an additional time',
                'player1 plays Neuro Syphon',
                'player1 uses Fission Bloom to resolve the bonus icons of Neuro Syphon an additional time',
                "player1 uses Neuro Syphon's amber bonus icon to gain 1 amber",
                "player1 uses Neuro Syphon's amber bonus icon to gain 1 amber"
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('fission bloom with amphora captura replacement', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    house: 'logos',
                    hand: ['neuro-syphon'],
                    inPlay: ['fission-bloom', 'amphora-captura', 'batdrone']
                },
                player2: {
                    amber: 3
                }
            });
        });

        it('should log correct message when fission bloom doubles and amphora replaces', function () {
            this.player1.useAction(this.fissionBloom);
            this.player1.play(this.neuroSyphon);
            this.player1.clickPrompt('capture');
            this.player1.clickCard(this.batdrone);
            this.player1.clickPrompt('amber');
            expect(this).toHaveAllChatMessagesBe([
                'player1 uses Fission Bloom to resolve the bonus icons of the next card played an additional time',
                'player1 plays Neuro Syphon',
                'player1 uses Fission Bloom to resolve the bonus icons of Neuro Syphon an additional time',
                "player1 uses Amphora Captura to resolve Neuro Syphon's amber bonus icon as a capture bonus icon",
                "player1 uses Neuro Syphon's capture bonus icon to capture 1 amber onto Batdrone",
                "player1 uses Neuro Syphon's amber bonus icon to gain 1 amber",
                'player1 uses Neuro Syphon to steal an amber and draw a card',
                'player1 draws 1 card'
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
