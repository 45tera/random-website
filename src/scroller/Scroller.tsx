import React, { useState, useRef, useEffect } from 'react';

const months = [
    "","", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",   "","", 
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);

// Define the height of a single item in the scroller.
// This must match the py-2/py-1 (padding-top and padding-bottom) and text size.
// The current implementation assumes a line height + padding of 40px for months
// and 32px for days based on common Tailwind defaults for similar styles.
const MONTH_ITEM_HEIGHT = 40; // Example: py-2 often means 0.5rem (8px) top/bottom padding + text size. Let's use 40px as a typical line height.
const DAY_ITEM_HEIGHT = 32;   // Example: py-1 often means 0.25rem (4px) top/bottom padding + text size. Let's use 32px as a typical line height.


function Scroller() {
    const [selectMonth, setMonth] = useState("January");
    const [selectDay, setDay] = useState(1);

    // 1. Create Refs for the scrollable containers
    const monthScrollerRef = useRef(null);
    const dayScrollerRef = useRef(null);

    // Function to calculate and set the centered item
    const updateSelectedItem = (ref, items, setItem, itemHeight) => {
        if (ref.current) {
            const { scrollTop, clientHeight } = ref.current;
            const centerScrollPosition = scrollTop + clientHeight / 2;
            const index = Math.round((centerScrollPosition - itemHeight / 2) / itemHeight);

            const clampedIndex = Math.max(0, Math.min(items.length - 1, index));

            setItem(items[clampedIndex]);
        }
    };

    // 2. Event Handlers - use setTimeout/debounce to fire logic after scrolling stops
    let monthScrollTimeout: number | undefined;
    const handleMonthScroll = () => {
        clearTimeout(monthScrollTimeout);
        monthScrollTimeout = setTimeout(() => {
            updateSelectedItem(monthScrollerRef, months, setMonth, MONTH_ITEM_HEIGHT);
        }, 150); // 150ms delay to wait for scrolling to settle
    };

    let dayScrollTimeout: number | undefined;
    const handleDayScroll = () => {
        clearTimeout(dayScrollTimeout);
        dayScrollTimeout = setTimeout(() => {
            updateSelectedItem(dayScrollerRef, days, setDay, DAY_ITEM_HEIGHT);
        }, 150); // 150ms delay to wait for scrolling to settle
    };

    // 3. Initial Scroll Position to center the selected item
    // Use useEffect to run this after the component mounts and the refs are set.
    const centerSelectedOnMount = (ref: React.RefObject<null>, selectedItem: string | number, items: string | any[], itemHeight: number) => {
        if (ref.current) {
            const index = items.indexOf(selectedItem);
            if (index !== -1) {
                const { clientHeight } = ref.current;
                // Calculate the scroll position needed to center the item at the index
                const scrollTo = (index * itemHeight) - (clientHeight / 2) + (itemHeight / 2);

                // Use setTimeout to ensure the DOM has rendered and the snap is settled
                setTimeout(() => {
                    ref.current.scrollTop = scrollTo;
                }, 0);
            }
        }
    };

    useEffect(() => {
        // Center the initial selected month
        centerSelectedOnMount(monthScrollerRef, selectMonth, months, MONTH_ITEM_HEIGHT);
        // Center the initial selected day
        centerSelectedOnMount(dayScrollerRef, selectDay, days, DAY_ITEM_HEIGHT);
    }, []); // Empty dependency array means this runs only once after the initial render

    const MONTH_CLASS = 'h-10 flex items-center justify-center';
    const DAY_CLASS = 'h-8 flex items-center justify-center';


    return (
        <div>
            <div className="relative flex justify-center items-center gap-12">

                {/* Visualizer for the center line (optional, but helpful for debugging) */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="h-[32px] bg-black/10 rounded-lg w-full absolute top-1/2 -translate-y-1/2"></div>
                </div>

                {/* Month */}
                <div
                    ref={monthScrollerRef} // Attach Ref
                    onScroll={handleMonthScroll} // Attach Scroll Handler
                    className='snap-y snap-mandatory overflow-y-scroll h-[12rem] w-32 text-lg no-scrollbar' // Changed to overflow-y-scroll for better event handling
                >
                    {/* The surrounding snap-center div is not necessary and can interfere with centering */}
                    
                    {/* Items are mapped directly */}
                    {months.map((month) => (
                        <div
                            key={month}
                            // Apply consistent item height
                            className={`snap-center transition ${MONTH_CLASS} ${month === selectMonth ? "bg-white text-red-500 font-bold" : "text-gray-500"}`}
                        // Remove onClick since selection is driven by scroll position
                        >
                            {month}
                        </div>
                    ))}
                </div>

                {/* Day */}
                <div
                    ref={dayScrollerRef} // Attach Ref
                    onScroll={handleDayScroll} // Attach Scroll Handler
                    className='snap-y snap-mandatory overflow-y-scroll h-[12rem] w-12 text-lg no-scrollbar' // Changed to overflow-y-scroll
                >
                    {/* Items are mapped directly */}
                    {days.map((day) => (
                        <div
                            key={day}
                            // Apply consistent item height
                            className={`snap-center cursor-pointer transition ${DAY_CLASS} ${day === selectDay ? "bg-white text-red-500 font-bold" : "text-gray-500"}`}
                        // Remove onClick
                        >
                            {String(day).padStart(2, "0")}
                        </div>
                    ))}

                    
                </div>

            </div>
            {/* Display selected date */}
            <div className="mt-8 text-xl font-semibold text-center">
                Selected Date: {selectMonth} {String(selectDay).padStart(2, "0")}
            </div>
        </div>
    )
}

export default Scroller;