import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

const data = [[
    { value: 36, name: 'South Route' },
    { value: 64, name: 'North Route' },
],
[
    { value: 34, name: 'South Route' },
    { value: 66, name: 'North Route' },
]
]

export default function RouteChart(props: { id: number }) {

    const chartRef = useRef<HTMLDivElement>(null);

    const option = {
        tooltip: false,
        legend: {
            top: '0%',
            left: 'center',
            textStyle: {
                color: '#fff',
                fontSize: 14,
                fontWeight: 'normal',
                fontFamily: 'Arial',
                padding: [0, 4]
            },
            itemWidth: 25,
            itemHeight: 14,
            itemGap: 25,
            orient: 'horizontal',
            selectedMode: true,
            backgroundColor: 'transparent',
            borderColor: '#ccc',
            borderWidth: 0,
            borderRadius: 0,
            padding: [5, 5, 5, 5]
        },

        visualMap: {
            show: false,
            min: 0,
            max: 100,
            inRange: {
                // 蓝色系
                color: ['#002766', '#91d5ff'],  // 从浅蓝到深蓝
            }
        },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center',
                    formatter: '{b}: {c}%'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data[props.id]
            }
        ]
    };


    useEffect(() => {
        const chart = echarts.init(chartRef.current);
        chart.setOption(option);

        return () => {
            chart.dispose();
        };
    }, [props.id]);

    return <div
        ref={chartRef}
        style={{
            width: '100%',
            minHeight: '300px',
            userSelect: 'none',
        }}
    />
}