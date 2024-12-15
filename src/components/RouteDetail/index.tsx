import classNames from "classnames";
import style from "./index.module.scss";
import northRoute from "../../assets/Images/NorthRoute.jpg"
import southRoute from "../../assets/images/SouthRoute.jpg"
import * as echarts from 'echarts';
import { useEffect, useRef, useState } from "react";


const images = [
    southRoute,
    northRoute
]
const data = [
    [
        { value: 39, name: 'Avalanche' },
        { value: 27, name: 'Fall' },
        { value: 18, name: 'AMS' },
        { value: 6, name: 'Exposure/Frostbite' },
        { value: 15, name: 'Illness (Non-AMS)' },
        { value: 15, name: 'Exhaustion' },
        { value: 13, name: 'Glacier Collapse' },
        { value: 10, name: 'Crevasse' },
        { value: 2, name: 'Missing' },
        { value: 3, name: 'Falling Ice/Rockfall' },
        { value: 2, name: 'Other/Unknown' },
    ],
    [
        { value: 7, name: 'Avalanche' },
        { value: 19, name: 'Fall' },
        { value: 14, name: 'AMS' },
        { value: 10, name: 'Exposure/Frostbite' },
        { value: 5, name: 'Illness (Non-AMS)' },
        { value: 12, name: 'Exhaustion' },
        { value: 4, name: 'Missing' },
        { value: 3, name: 'Other/Unknown' },
    ],
]

export default function RouteDetail(
    props: {
        isActive: boolean,
        id: number,
        name: string,
        length: string,
        totalSummiteers: string,
        fatalityRate: string,
        deathToll: string,
    }) {


    return (
        <div className={classNames(style.routeDetail, {
            [style.active]: props.isActive
        })}>
            <div className={style.content}>
                {/* 标题区域 */}
                <div className={style.header}>
                    <div className={style.name}>{props.name}</div>
                    <span className={style.length}>
                        Approximately&nbsp;
                        <span style={{ color: '#ddd', fontSize: '20px' }}>{props.length}</span>
                        &nbsp;from Base Camp to the summit
                    </span>
                </div>
                <img src={images[props.id]} alt="routeImage" className={style.image} />
                {/* 基础信息卡片 */}
                <div className={style.infoCards}>
                    <div className={style.infoCard}>
                        <div className={style.label}>Total Summiteers</div>
                        <div className={style.value}>{props.totalSummiteers}</div>
                    </div>
                    <div className={style.infoCard}>
                        <div className={style.label}>Fatality Rate</div>
                        <div className={style.value}>{props.fatalityRate}</div>
                    </div>
                    <div className={style.infoCard}>
                        <div className={style.label}>Death Toll</div>
                        <div className={style.value}>{props.deathToll}</div>
                    </div>
                </div>
                <RoseChart id={props.id} />
            </div>
        </div>
    );
}

const RoseChart = (props: { id: number }) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const [, setChart] = useState<echarts.ECharts>();

    const option = {
        backgroundColor: 'transparent',
        title: {
            text: 'Death Reasons',
            left: '0px',
            top: 20,
            textStyle: {
                color: '#eee'
            }
        },
        tooltip: {
            trigger: 'item'
        },
        visualMap: {
            show: false,
            min: Math.min(...data[props.id].map(item => item.value)),
            max: Math.max(...data[props.id].map(item => item.value)),
            inRange: {
                color: ['#cceeff', '#003366'],
                colorLightness: [0.5, 0.8]
            }
        },
        series: [
            {
                type: 'pie',
                radius: ['10%', '50%'],
                center: ['50%', '50%'],
                data: data[props.id].sort(function (a, b) {
                    return a.value - b.value;
                }),
                roseType: 'radius',
                label: {
                    color: 'rgba(255, 255, 255, 0.8)'
                },
                labelLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                },
                itemStyle: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function () {
                    return Math.random() * 200;
                }
            }
        ]
    };

    useEffect(() => {
        const myChart = echarts.init(chartRef.current);
        myChart.setOption(option);
        setChart(myChart);
        
    }, [props.id]);
    return <>
        <div
            ref={chartRef}
            style={{
                marginTop: '-20px',
                width: '100%',
                minHeight: '300px',
                userSelect: 'none'
            }}
        />
    </>
}