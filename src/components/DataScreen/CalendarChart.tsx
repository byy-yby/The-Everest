import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import calendarData from '../../../public/Info/calendarData.json';

type CalendarDataType = [string, number][];

interface CalendarChartProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

const CalendarChart: React.FC<CalendarChartProps> = ({
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    // 处理数据
    // 生成1950-2024的所有年份
    const years = Array.from({ length: 2024 - 1950 + 1 }, (_, i) => (1950 + i).toString());
    const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'];
    
    // 创建一个Map来存储现有数据
    const dataMap = new Map();
    (calendarData as CalendarDataType).forEach(([dateStr, value]) => {
      dataMap.set(dateStr, value);
    });

    // 生成完整的数据集，包括缺失的年份和季节
    const formattedData = years.flatMap((year, xIndex) => 
      seasons.map((season, yIndex) => {
        const key = `${year}-${season}`;
        return [xIndex, yIndex, dataMap.get(key) || 0];
      })
    );

    const option = {
      tooltip: {
        position: 'top',
        formatter: function (params: any) {
          const year = years[params.data[0]];
          const season = seasons[params.data[1]];
          return `${year} ${season}: ${params.data[2]} climbers`;
        }
      },
      grid: {
        top: '30px',
        bottom: '30px',
        left: '0px',
        right: '20px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: years,
        splitArea: {
          show: true
        },
        axisLabel: {
          rotate: 90,
          fontSize: 12,
          interval: 4,
          margin: 12,
          color: '#fff'
        },
        axisTick: {
          alignWithLabel: true,
          length: 6
        }
      },
      yAxis: {
        type: 'category',
        data: seasons,
        splitArea: {
          show: true
        },
        axisLabel: {
          color: '#FFFFFF'
        }
      },
      series: [{
        type: 'heatmap',
        data: formattedData,
        label: {
          show: false
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.1)'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(51, 133, 255, 0.5)'
          }
        }
      }],
      visualMap: {
        show: false,
        min: 0,
        max: 200,
        inRange: {
          color: [
            'rgba(0, 0, 0, 0.3)',
            'rgba(51, 133, 255, 0.2)',
            'rgba(51, 133, 255, 0.4)',
            'rgba(51, 133, 255, 0.6)',
            'rgba(51, 133, 255, 0.8)',
            'rgba(51, 133, 255, 0.9)',
            'rgba(51, 133, 255, 1)'
          ]
        }
      }
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
      style={{
        minHeight: '300px',
        minWidth: '300px',
        userSelect: 'none'
      }}
    />
  );
};

export default CalendarChart; 