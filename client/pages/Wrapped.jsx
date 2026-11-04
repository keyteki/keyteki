import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import AlertPanel from '../Components/Site/AlertPanel';
import WrappedStory from '../Components/Wrapped/WrappedStory';
import { useGetWrappedQuery } from '../redux/api';

// Not linked from any menu: players reach it from the Wrapped email
const Wrapped = () => {
    const { t } = useTranslation();
    const { year } = useParams();
    const user = useSelector((state) => state.account.user);
    const { data, error, isLoading } = useGetWrappedQuery(year, { skip: !user });

    if (!user) {
        return (
            <div className='mx-auto flex max-w-xl flex-col items-center gap-3 py-10 text-center'>
                <p>{t('Log in to see your {{year}} Wrapped.', { year })}</p>
                <Link
                    className='font-semibold text-[color:var(--link)]'
                    to={`/login?return=${encodeURIComponent(`/wrapped/${year}`)}`}
                >
                    {t('Log in')}
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return <p className='py-10 text-center'>{t('Loading...')}</p>;
    }

    if (error || !data?.wrapped) {
        return (
            <div className='mx-auto max-w-xl py-6'>
                <AlertPanel
                    type='info'
                    message={
                        error?.status === 404
                            ? t(
                                  "There's no {{year}} Wrapped for you. Players need at least 10 finished games in the year to get one.",
                                  { year }
                              )
                            : error?.status === 410
                            ? t('Your {{year}} Wrapped is no longer available.', { year })
                            : t('Your Wrapped could not be loaded.')
                    }
                />
            </div>
        );
    }

    return <WrappedStory username={user.username} wrapped={data.wrapped} />;
};

export default Wrapped;
