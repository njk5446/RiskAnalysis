import React from 'react'

export default function PCountBar({ userCount, normalCount, cautionCount, dangerCount }) {


    return (
        <div className="flex flex-wrap justify-around">
            <div className="flex flex-col items-center justify-center absolute w-[22vw] h-[10.5vh] sm:w-[20vw] sm:h-[9.5vh] lg:w-[18vw] lg:h-[8.5vh] left-[2.5vw] top-[3vw] bg-[#ffffffdc] rounded-[15px] z-10 transition-transform">
                <img src='./img/allll.png' className="w-11 h-11 absolute top-[22%] left-[80%]" />
                <h3 className="absolute left-4 top-4 text-[15px] font-normal text-[#000000B2]">현재 인원</h3>
                <p className="absolute left-4 top-[34%] text-[25px] font-sans mt-2">{userCount}</p>
            </div>

            <div className="flex flex-col items-center justify-center absolute w-[22vw] h-[10.5vh] sm:w-[20vw] sm:h-[9.5vh] lg:w-[18vw] lg:h-[8.5vh] left-[21.5vw] top-[3vw] bg-[#6edf87d7] rounded-[15px] z-10 transition-transform">
                <img src='./img/normall.png' className="w-11 h-11 absolute top-[22%] left-[80%]" />
                <h3 className="absolute left-4 top-4 text-[15px] font-normal text-white">정상 인원</h3>
                <p className="absolute left-4 top-[34%] text-[25px] font-sans text-white mt-2">{normalCount}</p>
            </div>

            <div className="flex flex-col items-center justify-center absolute w-[22vw] h-[10.5vh] sm:w-[20vw] sm:h-[9.5vh] lg:w-[18vw] lg:h-[8.5vh] left-[40.5vw] top-[3vw] bg-[#eab24ad7] rounded-[15px] z-10 transition-transform">
                <img src='./img/cautionn.png' className="w-11 h-11 absolute top-[22%] left-[80%]" />
                <h3 className="absolute left-4 top-4 text-[15px] font-normal text-white">주의 인원</h3>
                <p className="absolute left-4 top-[34%] text-[25px] font-sans text-white mt-2">{cautionCount}</p>
            </div>

            <div className="flex flex-col items-center justify-center absolute w-[22vw] h-[10.5vh] sm:w-[20vw] sm:h-[9.5vh] lg:w-[18vw] lg:h-[8.5vh] left-[59.5vw] top-[3vw] bg-[#e95454d3] rounded-[15px] z-10 transition-transform">
                <img src='./img/dangerr.png' className="w-11 h-11 absolute top-[22%] left-[80%]" />
                <h3 className="absolute left-4 top-4 text-[15px] font-normal text-white">위험 인원</h3>
                <p className="absolute left-4 top-[43%] text-[25px] font-sans text-white mt-1">{dangerCount}</p>
            </div>
        </div>

    )
}
