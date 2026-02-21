import React from 'react';
import { Button } from '@heroui/react';

import { Constants } from '../../constants';
import ThronesIcon from '../GameBoard/ThronesIcon';

const CardTypeFilter = ({ className, filter, setFilter, types = Constants.CardTypes }) => {
    return (
        <div className={`flex flex-wrap gap-1 ${className || ''}`}>
            {types.map((type) => {
                const selected = filter.some((t) => t === type.value);

                return (
                    <Button
                        key={type.value}
                        isIconOnly
                        size='sm'
                        variant={selected ? 'primary' : 'secondary'}
                        onPress={() =>
                            setFilter(
                                selected
                                    ? filter.filter((t) => t !== type.value)
                                    : filter.concat(type.value)
                            )
                        }
                    >
                        <ThronesIcon icon={type.value} />
                    </Button>
                );
            })}
        </div>
    );
};

export default CardTypeFilter;
