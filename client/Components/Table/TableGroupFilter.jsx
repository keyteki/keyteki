import React, { useState } from 'react';
import LoadingSpinner from '../Site/LoadingSpinner';
import { Button, Checkbox } from '@heroui/react';

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
        content = <LoadingSpinner />;
    } else if (isError) {
        content = <div>Failed to load options</div>;
    } else {
        content = (
            <div>
                {data.map((option) => {
                    return (
                        <div key={option}>
                            <Checkbox
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
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <>
            {content}
            <div className='mb-2 mt-2'>
                <Button
                    color='primary'
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
                <Button className='ml-2' color='default' onPress={onCancelClick}>
                    Cancel
                </Button>
            </div>
        </>
    );
};

export default TableGroupFilter;
