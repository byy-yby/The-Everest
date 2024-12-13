import style from './index.module.scss';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import classNames from 'classnames';

export default function Information(props: { isActive: boolean }) {

    return (
        <div className={classNames(style.information, {
            [style.active]: props.isActive
        })}>
            <div className={style.page}>
                <div className={style.title}>Introduction</div>
                
                <div className={style.container}>
                    <div className={style.textContent}>
                        <div className={style.smalltitle}>The Introduction Of The Everest</div>
                        <div style={{color: '#c9e1f2a0'}}>
                            Mount Everest, the highest peak in the world at 8,848.86 meters (29,029 feet), is located in the Himalayas on the Nepal-China border. Its Tibetan name means "Goddess Mother," highlighting its sacred significance. Climbing began in the early 20th century, with Edmund Hillary and Tenzing Norgay reaching the summit in 1953.
                        </div>
                        <div style={{ height: '12px' }}></div>
                        <div style={{color: '#c9e1f2a0'}}>
                            Each spring, climbers prepare for ascents from both the southern and northern sides, facing extreme weather and thin air. The region is enriched by the biodiversity and culture of the Sherpa people, known for their climbing expertise. Everest symbolizes human courage and perseverance.
                        </div>
                    </div>
                    
                    <div className={style.imageContent}>
                        <img src="src/assets/Himalaya.png" alt="Himalaya" />
                    </div>
                </div>

                <div className={style.container}>
                    
                    <div className={style.imageContent2} >     
                        <img src="src/assets/malori.jpg" alt="Mallory" />
                    </div>
                    <div className={style.textContent}>
                        <div className={style.smalltitle}>The Story</div>
                        <div style={{color: '#c9e1f2a0'}}>
                            The phrase "Because it's there," coined by mountaineer George Mallory, captures the spirit of human exploration and self-challenge in his desire to climb Mount Everest. It symbolizes the pursuit of the unknown, emphasizing that climbing is about pushing personal limits rather than just conquering a mountain. In 1924, Mallory and Andrew Irvine disappeared during their ascent, leaving their fate a mystery and fueling speculation about their success.
                        </div>
                        <div style={{ height: '12px' }}></div>
                        <div style={{color: '#c9e1f2a0'}}>
                            Today, Mallory's legacy inspires adventurers worldwide, emphasizing that mountaineering is about experiencing life and appreciating nature, driving humanity's relentless pursuit forward.
                        </div>
                    </div>
                </div>

                <div className={style.container}>
                    <div className={style.textContent}>
                        <div className={style.smalltitle}>Why We Build This Project</div>
                        <div style={{color: '#c9e1f2a0'}}>
                            This work aims to showcase the history of human exploration of Mount Everest and the courage involved in challenging one's limits through a 3D interactive website. Viewers can immerse themselves in the mountain's grandeur, exploring various areas and experiencing the unique allure of high altitudes. Our goal is to inspire audiences to pursue their dreams and transcend their limits, reflecting on the spirit of exploration and adventure that Everest represents.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}