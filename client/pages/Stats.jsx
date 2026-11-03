import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Button } from '@heroui/react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import AlertPanel from '../Components/Site/AlertPanel';
import Icon from '../Components/Icon';
import Panel from '../Components/Site/Panel';
import MonthlyStats from '../Components/Stats/MonthlyStats';
import { useGetMonthlyStatsQuery } from '../redux/api';

const Stats = () => {
    const { t, i18n } = useTranslation();
    const user = useSelector((state) => state.account.user);
    // Undefined asks the server for the latest month with games
    const [month, setMonth] = useState(undefined);
    const { data, error, isFetching } = useGetMonthlyStatsQuery(month, { skip: !user });

    if (!user) {
        return (
            <AlertPanel type='danger' message={t('You need to be logged in to view your stats')} />
        );
    }

    const months = data?.months || [];
    const shownMonth = data?.month;
    const index = months.indexOf(shownMonth);
    // Months are newest first
    const newer = index > 0 ? months[index - 1] : undefined;
    const older = index >= 0 && index < months.length - 1 ? months[index + 1] : undefined;

    const monthName = (value) =>
        new Intl.DateTimeFormat(i18n.language, {
            timeZone: 'UTC',
            month: 'long',
            year: 'numeric'
        }).format(new Date(`${value}-01T00:00:00Z`));

    let content;
    if (error) {
        content = (
            <AlertPanel
                type='danger'
                message={error.data?.message || t('Your stats could not be loaded.')}
            />
        );
    } else if (!data) {
        content = <p className='py-6 text-center text-foreground/80'>{t('Loading...')}</p>;
    } else if (!shownMonth) {
        content = (
            <p className='py-6 text-center text-foreground/80'>
                {t('Your stats will appear here once you have finished a game.')}
            </p>
        );
    } else {
        content = <MonthlyStats month={shownMonth} stats={data.stats} />;
    }

    return (
        <div className='w-full lg:mx-auto lg:w-10/12'>
            <Panel title={t('Your Stats')} contentClassName='gap-4 px-4 py-4'>
                {months.length > 0 && (
                    <div className='flex flex-wrap items-center justify-center gap-2'>
                        <Button
                            aria-label={t('Older month')}
                            isDisabled={!older || isFetching}
                            isIconOnly
                            size='sm'
                            variant='ghost'
                            onPress={() => setMonth(older)}
                        >
                            <Icon icon={faChevronLeft} />
                        </Button>
                        <select
                            aria-label={t('Month')}
                            className='rounded-md border border-border/75 bg-surface px-2 py-1 text-sm text-foreground'
                            value={shownMonth}
                            onChange={(event) => setMonth(event.target.value)}
                        >
                            {months.map((value) => (
                                <option key={value} value={value}>
                                    {monthName(value)}
                                </option>
                            ))}
                        </select>
                        <Button
                            aria-label={t('Newer month')}
                            isDisabled={!newer || isFetching}
                            isIconOnly
                            size='sm'
                            variant='ghost'
                            onPress={() => setMonth(newer)}
                        >
                            <Icon icon={faChevronRight} />
                        </Button>
                    </div>
                )}
                <div className={isFetching ? 'opacity-60 transition-opacity' : ''}>{content}</div>
            </Panel>
        </div>
    );
};

export default Stats;
