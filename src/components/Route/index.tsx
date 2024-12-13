import style from "./index.module.scss";

export default function Route(props: { name: string, route: string, info: string }) {
    return <div className={style.route}>
        <div className={style.name}>{props.name}</div>
        <div className={style.route}><span>Route:</span> {props.route}</div>
        <div className={style.info}><span>Introduction:</span> {props.info}</div>
    </div>
}