import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import peaksData from '../../../public/Info/peaks.json';

interface PeaksChartProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  data?: { name: string; height: number; climbable: boolean }[];
}

const PeaksChart: React.FC<PeaksChartProps> = ({
  width = '100%',
  height = '400px',
  className = '',
  data = peaksData
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts>();

  useEffect(() => {
    if (!chartRef.current) return;

    const initChart = () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }

      const chart = echarts.init(chartRef.current, undefined, {
        renderer: 'canvas'
      });
      
      chartInstance.current = chart;

      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        dataZoom: [{
          id: 'dataZoomX',
          type: 'slider',
          show: false,
          xAxisIndex: [0],
          start: 0,
          end: 10,
          height: 20,
          bottom: 10,
          borderColor: '#ddd',
          textStyle: {
            color: '#666'
          },
          handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
          },
          dataBackground: {
            lineStyle: {
              color: '#ddd'
            },
            areaStyle: {
              color: '#eee'
            }
          }
        }, {
          type: 'inside',
          xAxisIndex: [0],
          start: 0,
          end: 10,
          zoomOnMouseWheel: false,
          moveOnMouseMove: true,

        }],
        grid: {
          top: 40,
          bottom: 40,
          left: 60,
          right: 40,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.name),
          axisLabel: {
            color: '#3385FF',
            interval: 0,
            rotate: 45,
            fontSize: 10,
            margin: 15
          },
          axisTick: { show: false },
          axisLine: { show: true }
        },
        yAxis: {
          type: 'value',
          min: 5000,
          max: 9000,
          axisLabel: {
            color: '#fff',
            formatter: '{value} m'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#eee',
              type: 'dashed'
            }
          }
        },
        series: [{
          name: 'Altitude',
          type: 'bar',
          data: data.map(item => item.height),
          itemStyle: {
            color: (params: any) => {
              if (!data[params.dataIndex].climbable) {
                return 'rgba(102, 102, 102, 0.3)';
              }
              const height = data[params.dataIndex].height;
              const minHeight = 5000;
              const maxHeight = 9000;
              const percentage = (height - minHeight) / (maxHeight - minHeight);
              return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: `rgba(51, 133, 255, ${0.4 + percentage * 0.6})`
              }, {
                offset: 1,
                color: `rgba(77, 155, 255, ${0.5 + percentage * 0.5})`
              }]);
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0,0,0,0.5)'
            }
          }
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
    };

    const cleanup = initChart();

    return () => {
      cleanup?.();
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, [data]);

  return (
    <div 
      ref={chartRef} 
      className={className}
      style={{ 
        width, 
        height,
        overflow: 'hidden',
        position: 'relative',
        minHeight: '400px',
        userSelect: 'none'
      }}
    />
  );
};

export default PeaksChart;