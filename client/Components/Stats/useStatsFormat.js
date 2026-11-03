import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

/**
 * Formatting shared by the stats and Wrapped pages
 */
const useStatsFormat = () => {
    const { t, i18n } = useTranslation();
    const cards = useSelector((state) => state.cards.cards);
    const locale = i18n.language;

    return {
        t,
        locale,
        number: (value) => Math.round(value).toLocaleString(locale),
        // i18next pluralisation needs plural keys in every locale, so pick the English form here
        plural: (count, one, other) => (count === 1 ? t(one, { count }) : t(other, { count })),
        houseLabel: (house) => {
            const translated = t(house) || house;
            return translated[0].toUpperCase() + translated.slice(1);
        },
        cardName: (id) => cards?.[id]?.name || id,
        // Days are worked out in UTC on the server, so format them as UTC too
        formatDay: (day, options) =>
            new Intl.DateTimeFormat(locale, { timeZone: 'UTC', ...options }).format(
                new Date(`${day}T00:00:00Z`)
            )
    };
};

export default useStatsFormat;
