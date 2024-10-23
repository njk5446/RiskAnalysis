import React from 'react'
import styles from './OutsideTemperature.module.css';

export default function OutsideTemperature({ outsideTemperature }) {
  console.log('outsideTemperature', outsideTemperature);
  return (
    <div className="absolute top-[83vh] left-[92vw] flex justify-center items-center w-[10vh] h-[10vh] z-10 bg-[#a643dfc5] rounded-full text-white font-jura font-extrabold text-[0.4rem] sm:text-[0.7rem] md:text-[1.0rem] lg:text-[1.3rem]">
      <span>
        {outsideTemperature && outsideTemperature.length > 0
          ? outsideTemperature[outsideTemperature.length - 1].toFixed(1)
          : 'N/A'}°C
      </span>
    </div>
  )
}
