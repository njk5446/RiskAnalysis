import React from 'react'
import styles from './PCountBar.module.css'
export default function PCountBar({ userCount, normalCount, cautionCount, dangerCount }) {


    return (
        <div>
            <div className={styles.current}>
                <img src='./img/allll.png'  className={styles.imgCurrent} />
                <h3 className={styles.h3Current}>현재 인원</h3>
                <p className={styles.pCurrent}>{userCount}</p>
            </div>
            <div className={styles.normal}>
            <img src='./img/normall.png' className={styles.imgNormal} />
                <h3 className={styles.h3Normal}>정상 인원</h3>
                <p className={styles.pNormal}>{normalCount}</p>
            </div>
            <div className={styles.Caution}>
                <img src='./img/cautionn.png' className={styles.imgCaution} />
                <h3 className={styles.h3Caution}>주의 인원</h3>
                <p className={styles.pCaution}>{cautionCount}</p>
            </div>
            <div className={styles.Danger}>
                <img src='./img/dangerr.png' className={styles.imgDanger} />
                <h3 className={styles.h3Danger}>위험 인원</h3>
                <p className={styles.pDanger}>{dangerCount}</p>
            </div>

        </div>

    )
}
