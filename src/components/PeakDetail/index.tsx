import classNames from "classnames";
import style from "./index.module.scss";
import Everest from "../../assets/Images/Everest.jpg";
import Lhotse from "../../assets/Images/Lhotse.jpg";
import Nuptse from "../../assets/Images/Nuptse.jpg";
import Changtse from "../../assets/Images/Changtse.jpg";


const images = [
    Everest,
    Lhotse,
    Nuptse,
    Changtse
]

export default function PeakDetail(
    props: {
        isActive: boolean,
        id: number,
        name: string,
        height: string,
        rank: string,
        location: string,
        firstClimbing: string,
        summitCount: string,
        history: string,
    }) {

    return (
        <div className={classNames(style.peakDetail, {
            [style.active]: props.isActive
        })}>
            <div className={style.content}>
                {/* 标题区域 */}
                <div className={style.header}>
                    <div className={style.name}>{props.name}</div>
                    <span className={style.altitude}>{props.height}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                    <span className={style.location}>{props.location}</span>
                </div>
                <img src={images[props.id]} alt="peakImage" className={style.image} />
                {/* 基础信息卡片 */}
                <div className={style.infoCards}>
                    <div className={style.infoCard}>
                        <div className={style.label}>Elevation Ranking</div>
                        <div className={style.value}>{props.rank}</div>
                    </div>
                    <div className={style.infoCard}>
                        <div className={style.label}>First Climbing Year</div>
                        <div className={style.value}>{props.firstClimbing}</div>
                    </div>
                    <div className={style.infoCard}>
                        <div className={style.label}>Summit Count</div>
                        <div className={style.value}>{props.summitCount}</div>
                    </div>
                </div>
                <div className={style.title}>History of Climbing</div>
                <div className={style.history}>{props.history}</div>
            </div>
        </div>
    );
}