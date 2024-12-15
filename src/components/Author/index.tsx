import style from './index.module.scss';
import classNames from 'classnames';

export default function Author(props: { isActive: boolean }) {

    return (
        <div className={classNames(style.author, {
            [style.active]: props.isActive
        })}>
            {
                <div className={style.page}>
                    <div className={style.person}>
                        <div className={style.image}>
                            <img src="src/assets/byy.png" alt="Bangyi Yan" />
                        </div>
                        <div className={style.name}> Bangyi Yan</div>
                        <div className={style.smalltitle}>Basic Information</div>
                        <div className={style.text}>
                            Bangyi Yan, a 20-year-old from Wenzhou, Zhejiang, is currently pursuing a bachelor's degree in Industrial Design at Zhejiang University. Known for a strong aptitude for learning new technologies, this project marks the first experience with front-end frameworks, GSAP, ECharts, and Three.js.
                        </div>
                        <div className={style.smalltitle}>Reflection To The Project</div>
                        <div className={style.text}>
                            Before this project, I always thought "Because it's there" was a rather absurd answer. However, through the process of visualization and data analysis, I witnessed a history of humanity's pursuit of peaks. The significance of climbing Everest lies in challenging limits: initially, it was about pushing human limits, then it became a challenge for nations, and now it has transformed into a personal challenge. At the same time, I corrected my previous misconceptions; in reality, the death rate for climbing Everest isn't as high as I thought, haha.
                        </div>
                        <div className={style.smalltitle}>Task Allocation</div>
                        <div className={style.text}>
                            1.Created all content for the first webpage, including text and number animations controlled by GSAP, a 3D Earth model created and visualized with ECharts, and processed data on Everest climbs from various countries into a visual animation.
                            2.Used Python code to process the raw data from the Himalayan Dataset.
                            3.Completed a data dashboard using various ECharts chart types.
                            4.Developed the frontend and wrote content for the "Background Introduction" and "Author Information" sections.
                        </div>
                    </div>
                    <div className={style.person}>
                        <div className={style.image}>
                            <img src="src/assets/lss.png" alt="Sirui Lin" />
                        </div>
                        <div className={style.name}> Sirui Lin</div>
                        <div className={style.smalltitle}>Basic Information</div>
                        <div className={style.text}>
                            Sirui Lin, a 20-year-old boy from Guangzhou, Guangdong, is currently pursuing a bachelor's degree in Industrial Design at Zhejiang University.He is interested in programming, and by combining industrial design and programming, he tries to present design ideas in a dynamic way in his course projects, giving “life” to the design with code.
                        </div>
                        <div className={style.smalltitle}>Reflection To The Project</div>
                        <div className={style.text}>
                            After learning about my friend's idea, I realized that this was a highly challenging frontend data visualization project, which was a perfect opportunity to hone my frontend coding skills. We instantly hit it off and decided to work on the project together. Despite encountering numerous difficulties during the learning and implementation process, we actively discussed and overcame the challenges, ultimately achieving a result that we were both very satisfied with.
                        </div>
                        <div className={style.smalltitle}>Task Allocation</div>
                        <div className={style.text}>
                            1.Set up the project using the Vite + React framework, including routing configuration and project structure.
                            2.Implemented model import, camera control, and key point and route annotation on the webpage using Three.js.
                            3.Built the UI using the Ant Design UI library along with some custom designs.
                            4.Created a data visualization dashboard for the two main routes.
                            5.Make a right-hand detailed data page for peaks and routes.
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}