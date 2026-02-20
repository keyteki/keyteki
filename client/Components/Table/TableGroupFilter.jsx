import React, { useState } from 'react';
import { Button, Checkbox, Spinner } from '@heroui/react';

const TableGroupFilter = ({ args, fetchData, onOkClick, filter, onCancelClick }) => {
    const { data, isLoading, isError } = fetchData(args);
    const initialFilterState = {};

    if (filter) {
        for (const value of filter) {
            initialFilterState[value] = true;
        }
    }

    const [filters, setFilters] = useState(initialFilterState);

    let content;

    if (isLoading) {
        content = (
            <div className='flex justify-center py-2'>
                <Spinner size='sm' />
            </div>
        );
    } else if (isError) {
        content = <div className='text-sm text-red-300'>Failed to load options</div>;
    } else {
        content = (
            <div className='grid gap-1'>
                {(data || []).map((option) => (
                    <Checkbox
                        key={option}
                        isSelected={filters[option]}
                        onValueChange={(value) => {
                            setFilters((prevState) => ({
                                ...prevState,
                                [option]: value
                            }));
                        }}
                    >
                        {option}
                    </Checkbox>
                ))}
            </div>
        );
    }

    return (
        <>
            {content}
            <div className='mb-2 mt-2 flex gap-2'>
                <Button
                    color='primary'
                    size='sm'
                    variant='primary'
                    onPress={() => {
                        const filterResult = [];

                        for (const [key, value] of Object.entries(filters)) {
                            if (value) {
                                filterResult.push(key);
                            }
                        }

                        onOkClick(filterResult);
                    }}
                >
                    Ok
                </Button>
                <Button size='sm' variant='tertiary' onPress={onCancelClick}>
                    Cancel
                </Button>
            </div>
        </>
    );
};

export default TableGroupFilter;
