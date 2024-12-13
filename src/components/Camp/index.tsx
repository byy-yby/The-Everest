import style from "./index.module.scss";

export default function Camp(props: { name: string, height: string, info: string }) {
    return <div className={style.camp}>
        <div className={style.name}>{props.name}</div>
        <div className={style.height}><span>Altitude:</span> {props.height}</div>
        <div className={style.info}><span>Introduction:</span> {props.info}</div>
    </div>
}