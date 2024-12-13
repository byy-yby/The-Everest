import style from "./index.module.scss";

export default function Peak(props: { name: string, height: string, rank: string, info: string }) {
    return <div className={style.peak}>
        <div className={style.name}>{props.name}</div>
        <div className={style.height}><span>Altitude:</span> {props.height}</div>
        <div className={style.rank}><span>Rank:</span> {props.rank}</div>
        <div className={style.info}><span>Introduction:</span> {props.info}</div>
    </div>
}