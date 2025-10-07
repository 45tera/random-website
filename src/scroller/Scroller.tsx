import  {  useState } from 'react'

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);

function Scroller() {

    const [selectMonth, setMonth] = useState("January");
    const [selectDay, setDay] = useState(1);

    return (
        <div>
            <div className="relative flex justify-center items-center gap-12">

                {/* Month */}
                <div className='snap-y snap-mandatory overflow-y-auto h-[12rem] no-scrollbar'>
                    <div className='snap-center snap-always'>
                        {months.map((month) => (
                            <div 
                                key={month}
                                className={`text-center py-2 transition ${month === selectMonth ? "bg-white text-red-500" : "text-gray-500"
                                    }`}
                                onClick={() => setMonth(month)}
                            >
                                {month}
                            </div>
                        ))}

                    </div>

                        

                </div>

                {/* Day */}
                <div className='snap-y snap-mandatory overflow-y-auto h-[12rem] no-scrollbar'>
                    <div className='snap-center snap-always'>
                        {days.map((day) => (
                            <div
                                key={day}
                                className={`snap-center text-center py-1 cursor-pointer transition ${day === selectDay ? "bg-white text-red-500" : "text-gray-500"
                                    }`}
                                onClick={() => setDay(day)}
                            >
                                {String(day).padStart(2, "0")}
                            </div>
                        ))}

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Scroller

