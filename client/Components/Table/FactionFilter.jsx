import React from 'react';
import { Button } from '@heroui/react';

import { Constants } from '../../constants';
import ThronesIcon from '../GameBoard/ThronesIcon';

const FactionFilter = ({ className, filter, setFilter, factions = Constants.Factions }) => {
    return (
        <div className={`flex flex-wrap gap-1 ${className || ''}`}>
            {factions.map((faction) => {
                const selected = filter.some((f) => f === faction.value);

                return (
                    <Button
                        key={faction.value}
                        isIconOnly
                        size='sm'
                        variant={selected ? 'primary' : 'secondary'}
                        onPress={() =>
                            setFilter(
                                selected
                                    ? filter.filter((f) => f !== faction.value)
                                    : filter.concat(faction.value)
                            )
                        }
                    >
                        <ThronesIcon icon={faction.value} />
                    </Button>
                );
            })}
        </div>
    );
};

export default FactionFilter;
