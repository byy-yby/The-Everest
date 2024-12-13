import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import riverData from '../../../public/Info/riverData.json';

interface RiverChartProps {
    width?: string | number;
    height?: string | number;
    marginTop?: string | number;
    marginBottom?: string | number;
    className?: string;
}

const RiverChart: React.FC<RiverChartProps> = ({
    height = '400px',
    className = ''
}) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chart = echarts.init(chartRef.current);

        // 定义原因映射
        const reasonMap: { [key: number]: string } = {
            4: 'Bad Weather',
            5: 'Natural Disaster',
            6: 'Fatality',
            7: 'Illness/Injury',
            8: 'Supply Shortage',
            9: 'Time Limitation',
            10: 'Route Difficulty',
            11: 'Not Started',
            12: 'Not Started',
            0: 'Other Reasons',
            1: 'Other Reasons',
            2: 'Other Reasons',
            3: 'Other Reasons',
            13: 'Other Reasons',
            14: 'Other Reasons'
        };

        // 合并相同原因的数据
        const mergedData = riverData.reduce((acc: any[], item) => {
            const reason = reasonMap[item.reason];
            const existingItem = acc.find(
                x => x.altitude === item.altitude && x.reason === reason
            );
            if (existingItem) {
                existingItem.count += item.count;
            } else {
                acc.push({
                    altitude: item.altitude,
                    count: item.count,
                    reason: reason
                });
            }
            return acc;
        }, []);

        // 计算总死亡人数
        const totalDeaths = mergedData.reduce((sum, item) => sum + item.count, 0);

        // 首先定义一个固定的原因顺序
        const reasonOrder = [
            'Other Reasons',
            'Bad Weather',
            'Natural Disaster',
            'Fatality',
            'Illness/Injury',
            'Supply Shortage',
            'Time Limitation',
            'Route Difficulty',
            'Not Started'
        ];

        // 修改获取 uniqueReasons 的方式
        const uniqueReasons = reasonOrder.filter(reason =>
            mergedData.some(item => item.reason === reason)
        );

        // 确保 formattedData 按照相同的顺序排序
        const formattedData = mergedData.map(item => {
            const percentage = (item.count / totalDeaths) * 100;
            return [item.altitude, percentage, item.reason];
        }).sort((a, b) => {
            return reasonOrder.indexOf(a[2] as string) - reasonOrder.indexOf(b[2] as string);
        });

        // 计算每个海拔高度的总死亡人数
        const deathsByAltitude = mergedData.reduce((acc: { [key: number]: number }, item) => {
            acc[item.altitude] = (acc[item.altitude] || 0) + item.count;
            return acc;
        }, {});

        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'line',
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.2)',
                        width: 1,
                        type: 'solid'
                    }
                },
                formatter: (params: any) => {
                    const altitude = params[0].value[0];
                    let result = `Altitude: ${altitude}m<br/>`;

                    // 计算该海拔的死亡率
                    const totalDeathsAtAltitude = deathsByAltitude[altitude] || 0;
                    const deathPercentage = ((totalDeathsAtAltitude / totalDeaths) * 100).toFixed(2);
                    result += `Stop Rate: ${deathPercentage}%<br/>`;

                    return result;
                }
            },
            legend: {
                data: uniqueReasons,
                textStyle: {
                    color: '#fff'
                }
            },
            singleAxis: {
                type: 'value',
                top: 50,
                bottom: 50,
                min: 0,
                max: 9000,
                axisLabel: {
                    formatter: '{value}m',
                    color: '#fff'
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            series: [{
                type: 'themeRiver',
                emphasis: {
                    focus: 'series',
                    blurScope: 'coordinateSystem'
                },
                data: formattedData,
                label: {
                    show: false
                },
                itemStyle: {
                    opacity: 0.8
                },
                color: [
                    'rgba(30, 144, 255, 0.8)',     // Other Reasons - 亮蓝色
                    'rgba(75, 192, 192, 0.8)',      // Bad Weather - 青色
                    'rgba(153, 102, 255, 0.8)',     // Natural Disaster - 紫色
                    'rgba(255, 99, 132, 0.8)',      // Fatality - 红色
                    'rgba(54, 162, 235, 0.8)',      // Illness/Injury - 深蓝色
                    'rgba(50, 205, 50, 0.8)',       // Supply Shortage - 绿色
                    'rgba(255, 159, 64, 0.8)',      // Time Limitation - 橙色
                    'rgba(128, 0, 128, 0.8)',       // Route Difficulty - 深紫色
                    'rgba(0, 191, 255, 0.8)'        // Not Started - 深绿色
                ]
            }]
        };

        chart.setOption(option);

        const handleResize = () => {
            chart.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.dispose();
        };
    }, []);

    return (
        <div
            ref={chartRef}
            className={className}
            style={{
                height,
                overflow: 'hidden',
                position: 'relative',
                minHeight: '400px',
                userSelect: 'none'
            }}
        />
    );
};

export default RiverChart; 