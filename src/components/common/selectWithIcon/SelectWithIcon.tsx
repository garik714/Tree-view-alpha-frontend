import React, { useRef, useState, useEffect, memo } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { IconsType } from '../iconCreater/IconCreater';
import selectArrow from '../../../assets/images/icons/select-arrow.svg';
import styles from './selectWithIcon.module.css';

interface SelectWithIconProps {
    handleOptionClick: (selectedOption: IconsType | File) => void;
    getOptions: () => void;
    selectedOption: Partial<IconsType | undefined>;
    options: IconsType[];
    disabled?: boolean;
}

function SelectWithIcon({
    selectedOption,
    handleOptionClick,
    getOptions,
    options,
    disabled,
}: SelectWithIconProps) {
    const selectRef = useRef() as React.RefObject<HTMLDivElement>;

    const [selectOptions, setSelectOptions] = useState<IconsType[]>(options);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        setSelectOptions(options);
    }, [options]);

    useEffect(() => {
        function handleClickOutside(event: any) {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectRef]);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleClick = (selectedOption: IconsType) => {
        handleOptionClick(selectedOption);
        setShowOptions(false);
    };

    return (
        <div ref={selectRef} className={`${styles.selectContainer} ${disabled ? styles.disabledSelect : ""}`}>
            <div className={styles.selectContent}>
                <div className={styles.selectedOptionWrapper}>
                    {
                        selectedOption && (
                            <div className={styles.selectedOption}>
                                {
                                    selectedOption.source ? (
                                         <img src={selectedOption.source} alt={selectedOption.source} />
                                    ) : null
                                }
                                <div className={styles.selectedOptionTitle}>
                                    {selectedOption.name}
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className={`${styles.selectIcon} ${!options.length ? styles.disabledOptions : ""} `}>
                    <img src={selectArrow} alt={selectArrow}
                         onClick={toggleOptions}
                    />
                </div>
            </div>
            {
                showOptions && selectOptions.length ? (
                    <div className={styles.optionsContainer}>
                        <InfiniteScroll
                            height={110}
                            dataLength={selectOptions.length}
                            hasMore={true}
                            loader={<></>}
                            next={getOptions}
                        >
                            {
                                selectOptions.map((option: IconsType, index) => {
                                    return (
                                        <div key={index}
                                             onClick={()=>handleClick(option)}
                                             className={styles.options}
                                        >
                                            <div className={styles.optionNameContainer}>
                                                {
                                                    option.source ? (
                                                        <img src={option.source} alt={option.source} />
                                                    ) : null
                                                }
                                                <label htmlFor={option.id}>{option.name}</label>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </InfiniteScroll>
                    </div>
                ) : null
            }
        </div>
    )
}

export default memo(SelectWithIcon);
