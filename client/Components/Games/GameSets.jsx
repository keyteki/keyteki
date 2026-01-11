import React from 'react';
import { Col, Form } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';

import CotAIcon from '../../assets/img/idbacks/341.png';
import AoAIcon from '../../assets/img/idbacks/435.png';
import WCIcon from '../../assets/img/idbacks/452.png';
import MMIcon from '../../assets/img/idbacks/479.png';
import DTIcon from '../../assets/img/idbacks/496.png';
import WoEIcon from '../../assets/img/idbacks/600.png';
import VM2023Icon from '../../assets/img/idbacks/609.png';
import GRIcon from '../../assets/img/idbacks/700.png';
import VM2024Icon from '../../assets/img/idbacks/737.png';
import ASIcon from '../../assets/img/idbacks/800.png';
import ToCIcon from '../../assets/img/idbacks/855.png';
import MoMuIcon from '../../assets/img/idbacks/874.png';
import PVIcon from '../../assets/img/idbacks/886.png';
import DiscIcon from '../../assets/img/idbacks/907.png';
import CCIcon from '../../assets/img/idbacks/918.png';
import VM2025Icon from '../../assets/img/idbacks/939.png';

import './GameSets.scss';

const GameSets = ({ formProps }) => {
    const { t } = useTranslation();

    let expansions = [
        { name: 'cota', label: t('Call of the Archons'), icon: CotAIcon },
        { name: 'aoa', label: t('Age of Ascension'), icon: AoAIcon },
        { name: 'wc', label: t('Worlds Collide'), icon: WCIcon },
        { name: 'mm', label: t('Mass Mutation'), icon: MMIcon },
        { name: 'dt', label: t('Dark Tidings'), icon: DTIcon },
        { name: 'woe', label: t('Winds of Exchange'), icon: WoEIcon },
        { name: 'gr', label: t('Grim Reminders'), icon: GRIcon },
        { name: 'as', label: t('Æmber Skies'), icon: ASIcon },
        { name: 'toc', label: t('Tokens of Change'), icon: ToCIcon },
        { name: 'momu', label: t('More Mutation'), icon: MoMuIcon },
        { name: 'disc', label: t('Discovery'), icon: DiscIcon },
        { name: 'pv', label: t('Prophetic Visions'), icon: PVIcon },
        { name: 'cc', label: t('Crucible Clash'), icon: CCIcon },
        { name: 'vm2023', label: t('Vault Masters 2023'), icon: VM2023Icon },
        { name: 'vm2024', label: t('Vault Masters 2024'), icon: VM2024Icon },
        { name: 'vm2025', label: t('Vault Masters 2025'), icon: VM2025Icon }
    ];

    const ffgSets = ['cota', 'aoa', 'wc', 'mm', 'dt'];
    const ggSets = [
        'woe',
        'gr',
        'as',
        'toc',
        'momu',
        'disc',
        'pv',
        'cc',
        'vm2023',
        'vm2024',
        'vm2025'
    ];
    const allSets = expansions.map((expansion) => expansion.name);

    // Compute switch states based on current selections
    const allFFGSelected = ffgSets.every((set) => formProps.values[set]);
    const allGGSelected = ggSets.every((set) => formProps.values[set]);
    const noFFGSelected = ffgSets.every((set) => !formProps.values[set]);
    const noGGSelected = ggSets.every((set) => !formProps.values[set]);

    const allChecked = allFFGSelected && allGGSelected;
    const ffgChecked = allFFGSelected && noGGSelected;
    const ggChecked = allGGSelected && noFFGSelected;

    const handleAllToggle = (e) => {
        const checked = e.target.checked;
        const updates = {};
        allSets.forEach((set) => {
            updates[set] = checked;
        });
        formProps.setValues({ ...formProps.values, ...updates });
    };

    const handleFFGToggle = (e) => {
        const checked = e.target.checked;
        const updates = {};
        ffgSets.forEach((set) => {
            updates[set] = checked;
        });
        if (checked) {
            ggSets.forEach((set) => {
                updates[set] = false;
            });
        }
        formProps.setValues({ ...formProps.values, ...updates });
    };

    const handleGGToggle = (e) => {
        const checked = e.target.checked;
        const updates = {};
        ggSets.forEach((set) => {
            updates[set] = checked;
        });
        if (checked) {
            ffgSets.forEach((set) => {
                updates[set] = false;
            });
        }
        formProps.setValues({ ...formProps.values, ...updates });
    };

    return (
        <>
            <Form.Group>
                <Form.Row>
                    <Col xs={12} className='font-weight-bold'>
                        <Trans>Sets</Trans>
                    </Col>
                </Form.Row>
                <Form.Row className='mb-2 mt-2'>
                    <Col xs={12}>
                        <Form.Check
                            type='switch'
                            id='all-sets'
                            label='All'
                            inline
                            onChange={handleAllToggle}
                            checked={allChecked}
                            className='mr-3'
                        />
                        <Form.Check
                            type='switch'
                            id='ffg-sets'
                            label='FFG'
                            inline
                            onChange={handleFFGToggle}
                            checked={ffgChecked}
                            className='mr-3'
                        />
                        <Form.Check
                            type='switch'
                            id='gg-sets'
                            label='GG'
                            inline
                            onChange={handleGGToggle}
                            checked={ggChecked}
                        />
                    </Col>
                </Form.Row>
                <Form.Row>
                    {expansions.map((expansion) => (
                        <Col key={expansion.name} lg='4'>
                            <Form.Check
                                type='switch'
                                id={expansion.name}
                                label={
                                    <>
                                        <img
                                            src={expansion.icon}
                                            className='set-icon'
                                            alt={expansion.label}
                                        />{' '}
                                        {expansion.label}
                                    </>
                                }
                                onChange={formProps.handleChange}
                                value='true'
                                checked={formProps.values[expansion.name]}
                            ></Form.Check>
                        </Col>
                    ))}
                </Form.Row>
            </Form.Group>
        </>
    );
};

export default GameSets;
