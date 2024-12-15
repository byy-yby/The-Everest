import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GlobeComponent } from 'echarts-gl/components';
import { GeoComponent } from 'echarts/components';
import { GridComponent } from 'echarts/components';
import { EffectScatterChart } from 'echarts/charts';
import "echarts-gl";
import styles from './index.module.scss';
import { climberData, EVEREST_COORDINATES } from './everestData';

// 注册所有必需的组件
echarts.use([
    GlobeComponent,
    GeoComponent,
    GridComponent,
    EffectScatterChart,
    CanvasRenderer
]);


export default function Page() {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<echarts.ECharts | null>(null);
    const yearRef = useRef<HTMLDivElement>(null);
    const [year, setYear] = useState<number>(1950);
    const [showPressEnter, setShowPressEnter] = useState<boolean>(false);
    const [canAcceptEnter, setCanAcceptEnter] = useState<boolean>(false);
    const navigate = useNavigate();
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // 获取 HTML 中的音频元素
        audioRef.current = document.getElementById('bgMusic') as HTMLAudioElement;
        
        if (audioRef.current) {
            audioRef.current.volume = 1;
            audioRef.current.play().catch(error => {
                console.error('音频播放失败:', error);
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    useEffect(() => {
        if (!chartRef.current) {
            console.error('chartRef is null');
            return;
        }

        try {
            const chart = echarts.init(chartRef.current);
            chartInstance.current = chart;
            
            chart.showLoading();
            
            const option = {
                backgroundColor: '#000',
                progressive: 25,  // 每帧渲染200个图形
                progressiveThreshold: 50,  // 超过100个图形时启用渐进式渲染
                globe: {
                    globeRadius: 40,
                    layoutCenter: ['75%', '75%'],
                    layoutSize: '60%',
                    viewControl: {
                        autoRotate: true,
                        distance: 200,
                        autoRotateSpeed: 12,
                        maxDistance: 300,
                        minDistance: 0,
                        center: [50, 30, 60],
                        alpha: 20,
                        beta: 90,
                        enableZoom: false,
                        animation: true,
                    },
                    atmosphere: {
                        enable: true,
                        glow: true,
                        glowColor: '#fff',
                        glowIntensity: 10
                    },
                    baseTexture: 'src/assets/world.topo.bathy.200401.jpg',
                    heightTexture: 'src/assets/world.topo.bathy.200401.jpg',
                    displacementScale: 0.01,
                    shading: 'realistic',
                    environment: 'src/assets/starfield.jpg',
                    realisticMaterial: {
                        roughness: 0.8,
                        metalness: 0
                    },
                    postEffect: {
                        enable: true,
                        bloom: {
                            enable: true
                        }
                    },
                    light: {
                        main: {
                            intensity: 1,
                            shadow: true
                        },
                        ambient: {
                            intensity: 0.5
                        }
                    }
                },
                series: [{
                    type: 'lines3D',
                    coordinateSystem: 'globe',
                    effect: {
                        show: true,
                        period: 2,
                        trailWidth: 1,
                        trailLength: 0.2,
                        trailOpacity: 0.6,
                        trailColor: '#00BFFF'
                    },
                    lineStyle: {
                        width: 1,
                        color: '#00BFFF',
                        opacity: 0.1
                    },
                    data: [] // 这里会根据年份动态更新
                }]
            };

            chart.setOption(option);
            chart.hideLoading();

            setTimeout(() => {
                chart.setOption({
                    globe: {
                        viewControl: {
                            autoRotate: true,
                            autoRotateSpeed: 12,
                            center: [0, 0, 0],
                            beta: 270,
                            distance: 150,
                            animationDurationUpdate: 8000,
                            animationEasingUpdate: 'linear'
                        }
                    }
                });

                setTimeout(() => {
                    if (yearRef.current) {
                        yearRef.current.style.opacity = '0';
                        setTimeout(() => {
                            yearRef.current!.style.opacity = '1';
                            yearRef.current!.style.transition = 'opacity 0.5s ease-in';
                        }, 500);
                    }
                    
                    const startYear = 1950;
                    const endYear = 2024;
                    const duration = 25000; // 改为15秒
                    const startTime = Date.now();
                    
                    const updateYear = () => {
                        const currentTime = Date.now();
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        const easeProgress = Math.pow(progress, 1.2);
                        const currentYear = Math.floor(startYear + (endYear - startYear) * easeProgress);
                        
                        setYear(currentYear);
                        
                        let cameraSpeed = 12;
                        if (currentYear >= 2010) {  
                            const slowDownProgress = (currentYear - 2010) / (endYear - 2010);
                            cameraSpeed = 12 * (1 - Math.pow(slowDownProgress, 0.8));
                        }
                        
                        chart.setOption({
                            globe: {
                                viewControl: {
                                    autoRotateSpeed: cameraSpeed,
                                    autoRotate: progress < 1
                                }
                            }
                        });
                        
                        const currentData = climberData.filter(data => data.year <= currentYear);
                        
                        const MAX_LINES_PER_YEAR = 300;
                        let lines;
                        
                        if (currentData.length > MAX_LINES_PER_YEAR) {
                            const sampledData = currentData.sort(() => 0.5 - Math.random()).slice(0, MAX_LINES_PER_YEAR);
                            lines = sampledData.map(data => ({
                                coords: [
                                    data.coordinates,
                                    EVEREST_COORDINATES
                                ],
                                value: data.count
                            }));
                        } else {
                            lines = currentData.map(data => ({
                                coords: [
                                    data.coordinates,
                                    EVEREST_COORDINATES
                                ],
                                value: data.count
                            }));
                        }
                        
                        chart.setOption({
                            series: [{
                                effect: {
                                    show: progress === 1  // 只在进度为1（即2024年）时显示动画效果
                                },
                                data: lines
                            }]
                        });
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateYear);
                        } else {
                            setTimeout(() => {
                                setShowPressEnter(true);
                                setCanAcceptEnter(true);
                            }, 1000);
                        }
                    };
                    
                    requestAnimationFrame(updateYear);
                }, 8000);
            }, 7200);

            const handleResize = () => {
                chart.resize();
            };
            window.addEventListener('resize', handleResize);

            return () => {
                chart.dispose();
                window.removeEventListener('resize', handleResize);
            };
        } catch (error) {
            console.error('Error initializing chart:', error);
        }
    }, []);

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter' && canAcceptEnter && chartInstance.current) {
            setCanAcceptEnter(false);
            setShowPressEnter(false);
            
            // 添加音频淡出效果
            if (audioRef.current) {
                const fadeAudio = setInterval(() => {
                    if (audioRef.current && audioRef.current.volume > 0.1) {
                        audioRef.current.volume -= 0.1;
                    } else {
                        if (audioRef.current) {
                            audioRef.current.pause();
                        }
                        clearInterval(fadeAudio);
                    }
                }, 200);
            }

            chartInstance.current.setOption({
                globe: {
                    viewControl: {
                        distance: 10,
                        animationDurationUpdate: 3000,
                        animationEasingUpdate: 'linear',
                        autoRotate: false
                    }
                }
            });

            setTimeout(() => {
                setShowOverlay(true);
                
                setTimeout(() => {
                    navigate('/mountH');
                }, 500);
            }, 2000);
        }
    };

    useEffect(() => {
        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [canAcceptEnter]);

    return (
        <div style={{ position: 'relative' }}>
            <div 
                ref={chartRef} 
                style={{ 
                    width: "100%", 
                    height: "100vh",
                    position: "relative",
                    backgroundColor: "#000"
                }}
            /> 
            <div className={styles['text-overlay']}>
                <div className={`${styles['animated-text']} ${styles['text-1']}`} style={{ top: '-80%', left: '0%'}}>
                    Why do you want to climb Mount Everest?
                </div>
                <div className={`${styles['animated-text']} ${styles['text-2']}`} style={{ top: '-60%', left: '-20%'}}>
                    Because it's there.
                </div>
            </div>
            <div className={styles['year-counter']} ref={yearRef} style={{ 
                top: '40px', 
                left: '40px', 
                fontSize: '5rem',
                position: 'absolute'
            }}>
                {year}
            </div>
            <div 
                className={styles['press-enter']} 
                style={{ opacity: showPressEnter ? 1 : 0 }}
            >
                Press enter key to continue.
            </div>
            <div 
                className={`${styles.overlay} ${showOverlay ? styles['overlay-visible'] : ''}`}
            />
        </div>
    );
}