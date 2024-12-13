import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface GaugeChartProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  value?: number;
  title?: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({
  width = '100%',
  height = 'auto',
  className = '',
  value = 34,
  title = ''
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const option: echarts.EChartsOption = {
      series: [{
        type: 'gauge',
        radius: '80%',
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 1,
            borderColor: 'rgba(65,105,225,0.8)',
            shadowColor: 'rgba(65,105,225,0.5)',
            shadowBlur: 10,
            shadowOffsetX: 2,
            shadowOffsetY: 2,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: '#6495ED'
              }, {
                offset: 1,
                color: '#4169E1'
              }]
            }
          }
        },
        axisLine: {
          lineStyle: {
            width: 15,
            color: [[1, 'rgba(230,235,248,0.3)']],
            shadowColor: 'rgba(0,0,0,0.1)',
            shadowBlur: 5,
            shadowOffsetX: 1,
            shadowOffsetY: 1
          }
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: 32,
          offsetCenter: [0, 0],
          formatter: '{value}%',
          color: '#4169E1',
          fontWeight: 'bold'
        },
        title: {  // 添加 title 配置
            show: true,
            fontSize: 14,
            color: '#fff',  // 设置较亮的颜色
            offsetCenter: [0, '30%']  // 调整位置
        },
        data: [{
          value: value,
          name: title
        }]
      }]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [value, title]);

  return (
    <div
      ref={chartRef}
      className={className}
      style={{
        width,
        height,
        minHeight: '300px'
      }}
    />
  );
};

export default GaugeChart; 