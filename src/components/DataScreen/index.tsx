import style from './index.module.scss';
import classNames from 'classnames';
import RiverChart from './RiverChart';
import PeaksChart from './PeaksChart';
import CalendarChart from './CalendarChart';
import GaugeChart from './GaugeChart';
import RouteChart from './RouteChat';

export default function DataScreen(props: { isActive: boolean }) {

    return <>
        <div className={classNames(style.dataScreen, {
            [style.active]: props.isActive
        })}>
            <div style={{ paddingLeft: '32px', paddingRight: '48px', paddingTop: '32px', paddingBottom: '32px' }}>
                <div className={style.title}>The History Data Of Himalaya</div>
                <div className={style.smalltitle} style={{ position:"relative", top: '40px' }}>Success rate, death rate, and injury rate</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', marginBottom: '-20px' }}>
                    <GaugeChart value={62.7} title="Success Rate" />
                    <GaugeChart value={1.3} title="Death Rate" />
                    <GaugeChart value={2.0} title="Injured Rate" />
                </div>
                <div className={style.text}>From this chart, we can see that the success rate of climbing Mount Everest has reached 62.7%, with the death rate and injury rate at only 1.3% and 2.0%, respectively. This suggests that with advancements in technology, climbing Everest is no longer as unattainable as it once was, and we need to view the difficulty of the ascent with a rational perspective.</div>
                <div className={style.smalltitle} style={{ position:"relative", top: '30px' }}>Peaks of the Himalayan mountain range</div>
                <PeaksChart />
                <div className={style.text}>This shows the elevation and climbability of over 200 peaks in the Himalayas. We can see that the lowest elevation exceeds 5,000 meters, with Mount Everest being the highest in the range, highlighting the challenges of climbing and helping us understand why our predecessors were driven to conquer it.</div>
                <div className={style.smalltitle}>Climber stop proportions at different elevations and reasons.</div>
                <RiverChart />
                <div className={style.text}>From this flow chart, we can see that among those who are known to have stopped their attempts to climb Mount Everest, the majority gave up before reaching base camp, highlighting the courage required for such an endeavor. Among those who proceeded with the climb, reasons for stopping included weather conditions, death, natural accidents, illness, and lack of supplies.</div>
                <div className={style.smalltitle} style={{ position:"relative", top: '30px' }}>Climbing calendar for Mount Everest</div>
                <CalendarChart />
                <div className={style.text}>From this calendar chart, we can see that as climbing techniques have advanced, the number of people attempting to summit Mount Everest has gradually increased since 1950, peaking in the 2000s and then stabilizing at a relatively high level (with a decline in 2021 due to the pandemic). We also observe that climbing Everest generally occurs in the spring and autumn seasons.</div>
                <div className={style.smalltitle}>Deaths and successful climbers from N/S sides</div>
                <div style={{ display: 'flex', gap: '20px' , width: '100%'}}>
                    <div style={{ flex: 1 , width: '50%'}}>
                        <RouteChart id={0} />
                    </div>
                    <div style={{ flex: 1 , width: '50%'}}>
                        <RouteChart id={1} />
                    </div>
                </div>
                <div className={style.text}>From these two pie charts, it can be seen that the death rate for climbing Mount Everest from the north side in China is lower. However, it is curious that more people reach the summit from the south side in Nepal. This is actually due to China's restrictions on the number of climbers allowed each year.</div>
            </div>
        </div>
    </>
}