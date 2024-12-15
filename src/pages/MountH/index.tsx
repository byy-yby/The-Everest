import { useEffect, useRef, useState } from "react";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import * as THREE from "three";

import Meum from "../../components/Menu";
import Camp from "../../components/Camp";
import Peak from "../../components/Peak";
import Route from "../../components/Route";
import PeakDetail from "../../components/PeakDetail";
import RouteDetail from "../../components/RouteDetail";


import campLabel from '../../assets/labels/camp.png';
import peakLabel from '../../assets/labels/triangle.png';
import { Button, ConfigProvider, Drawer, FloatButton, Popover } from "antd";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";

import { ReloadOutlined } from "@ant-design/icons";

const base = process.env.NODE_ENV === 'production' ? '/The-Everest/' : '/';

interface CampInfo {
    id: number;
    name: string;
    position: {
        x: number;
        y: number;
        z: number;
    };
    height: string;
    info: string;
}

interface PeakInfo {
    id: number;
    name: string;
    position: {
        x: number;
        y: number;
        z: number;
    };
    height: string;
    rank: string;
    location: string;
    info: string;
    firstClimbing: string;
    summitCount: string;
    history: string;
    camera: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
        };
    };
}

interface RouteInfo {
    id: number;
    name: string;
    route: string;
    length: string;
    totalSummiteers: string;
    fatalityRate: string;
    deathToll: string;
    info: string;
    camera: {
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
        };
    };
}

enum LabelType {
    Point = 'point',
    Triangle = 'triangle',
    Curve = 'curve'
}

const Mountain = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlRef = useRef<OrbitControls | null>(null);

    let renderer: THREE.WebGLRenderer;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let control: OrbitControls;
    let pmremGenerator: THREE.PMREMGenerator;

    const pointer = useRef(new THREE.Vector2());
    const raycaster = useRef(new THREE.Raycaster());

    let object: THREE.Object3D<THREE.Object3DEventMap> | null = null;
    let labelGeometries: THREE.BufferGeometry[] = [];

    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [isActive, setIsActive] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const [campId, setCampId] = useState<number>(-1);
    const [campInfos, setCampInfos] = useState<CampInfo[]>([]);
    const [peakId, setPeakId] = useState<number>(-1);
    const [peakInfos, setPeakInfos] = useState<PeakInfo[]>([]);
    const [routeId, setRouteId] = useState<number>(-1);
    const [routeInfos, setRouteInfos] = useState<RouteInfo[]>([]);
    const delta = 0.03;

    const [detailOpen, setDetailOpen] = useState(false);
    const [detailActive, setDetailActive] = useState(false);
    const [detailPeakId, setDetailPeakId] = useState<number>(-1);
    const [detailRouteId, setDetailRouteId] = useState<number>(-1);

    const GetLabelMaterial = (type: LabelType) => {
        let texture: string;
        switch (type) {
            case LabelType.Point:
                texture = campLabel;
                break;
            case LabelType.Triangle:
                texture = peakLabel;
                break;
        }
        return new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(0xffffff) },
                pointTexture: { value: new THREE.TextureLoader().load(texture!) }, // 使用圆形纹理
            },
            vertexShader:
                `attribute float size;
                attribute vec3 customColor;
                
                varying vec3 vColor;

                void main() {
                    vColor = customColor;

                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

                    gl_PointSize = size * ( 300.0 / -mvPosition.z );  // 设置点的大小
                    gl_Position = projectionMatrix * mvPosition;  // 计算投影矩阵
                }`
            ,
            fragmentShader:
                `uniform vec3 color;
                uniform sampler2D pointTexture;
                uniform float alphaTest;

                varying vec3 vColor;

                void main() {
                    gl_FragColor = vec4( color * vColor, 1.0 );  // 基本颜色

                    // 应用纹理
                    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

                }`
            ,
            transparent: true, // 启用透明
        });
    }

    const InitController = () => {
        control = new OrbitControls(camera, renderer.domElement);
        control.target.set(0, 0, 0);
        control.update();
        control.enablePan = true;
        control.enableDamping = true;

        // 限制俯仰角（翻转角度）
        control.minPolarAngle = 0; // 最小角度（0度）
        control.maxPolarAngle = (75 * Math.PI) / 180; // 精确75度

        // 设置最小和最大缩放距离
        control.minDistance = 2.5;  // 最小缩放距离（相机距离目标点的最小值）
        control.maxDistance = 12; // 最大缩放距离（相机距离目标点的最大值）

        controlRef.current = control;
    }

    const InitRenderer = () => {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef!.current!.appendChild(renderer.domElement);
    }

    const InitScene = () => {
        scene = new THREE.Scene();
        const bgLoader = new THREE.TextureLoader();
        const bgTexture = bgLoader.load(`${base}/starfield.jpg`);
        bgTexture.colorSpace = THREE.SRGBColorSpace;
        scene.background = bgTexture;
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    }

    const InitCamera = () => {
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.set(5, 2, 8);
        cameraRef.current = camera;
    }

    const InitPmremGenerator = () => {
        pmremGenerator = new THREE.PMREMGenerator(renderer);
    }

    const SetupLight = () => {
        const ambientLight = new THREE.AmbientLight(0x404040, 10); // 环境光
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 方向光
        directionalLight.position.set(5, 10, 5); // 设置光源位置
        scene.add(directionalLight);
    }

    const LoadModel = () => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('jsm/libs/draco/gltf/');

        // 加载 FBX 模型
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.load('/mount.glb', (object) => {
            const root = object.scene;
            root.position.set(2, 0, 0);
            root.scale.set(0.003, 0.003, 0.003);
            root.userData = { id: -1 };
            scene.add(root);

            LoadLabel();
        }, undefined, (error) => {
            console.error('FBX 模型加载失败', error);
        });
    }

    const ScaleLabel = (geometry: THREE.BufferGeometry, scale: number) => {
        let sizeAttribute = geometry.getAttribute('size');
        for (let i = 0; i < sizeAttribute.count; i++) {
            sizeAttribute.setX(i, sizeAttribute.getX(i) * scale);
        }
        sizeAttribute.needsUpdate = true;
    }

    const ResetLabel = () => {
        const lastGeometry = labelGeometries.find(geometry =>
            geometry.userData.type === object!.userData.type &&
            geometry.userData.id === object!.userData.id);

        if (lastGeometry) {
            switch (lastGeometry.userData.type) {
                case LabelType.Point:
                    setCampId(-1);
                    ScaleLabel(lastGeometry, 1 / 1.5);
                    break;
                case LabelType.Triangle:
                    setPeakId(-1);
                    ScaleLabel(lastGeometry, 1 / 1.5);
                    break;
                case LabelType.Curve:
                    setRouteId(-1);
                    UpdateLineWidthInScene(scene, object!.userData.id, 1 / 1.5);
                    break;
            }
        }
    }

    const onPointerMove = (event: MouseEvent) => {
        setPosition({
            top: event.clientY - 15,
            left: event.clientX - 15,
        });

        pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // 通过鼠标位置计算射线
        raycaster.current.setFromCamera(pointer.current, camera);
        raycaster.current.params.Points.threshold = 0.05;  // 调整这个值来改变检测范围

        // 获取与场景中物体的交集
        const intersects = raycaster.current.intersectObjects(scene.children, false);

        if (intersects.length > 0) {
            const newObject = intersects[0].object;
            if (object === newObject) return;

            if (object) {
                ResetLabel();
            }

            object = newObject;
            const geometry = labelGeometries.find(geometry =>
                geometry.userData.type === object!.userData.type &&
                geometry.userData.id === object!.userData.id);

            switch (object!.userData.type) {
                case LabelType.Point:
                    ScaleLabel(geometry!, 1.5);
                    setCampId(object!.userData.id);
                    break;
                case LabelType.Triangle:
                    ScaleLabel(geometry!, 1.5);
                    setPeakId(object!.userData.id);
                    break;
                case LabelType.Curve:
                    UpdateLineWidthInScene(scene, object!.userData.id, 1.5);
                    setRouteId(object!.userData.id);
                    break;
            }

            setIsActive(true);

        } else {
            if (object) {
                ResetLabel();
                setIsActive(false);

            }
            object = null;
        }
    }

    const onClick = () => {
        // console.log(camera.position);
        // console.log(camera.rotation);
        if (!object) {
            return;
        }
        switch (object!.userData.type) {
            case LabelType.Triangle:
                setPeakId(-1);
                setIsActive(false);
                animateCamera(
                    peakInfos[object!.userData.id].camera.position,
                    peakInfos[object!.userData.id].camera.rotation,
                    2000
                );
                setDetailOpen(true);
                setDetailPeakId(object!.userData.id);
                setDetailRouteId(-1);
                break;
            case LabelType.Curve:
                setRouteId(-1);
                setIsActive(false);
                animateCamera(
                    routeInfos[object!.userData.id].camera.position,
                    routeInfos[object!.userData.id].camera.rotation,
                    2000
                );
                setDetailOpen(true);
                setDetailRouteId(object!.userData.id);
                setDetailPeakId(-1);
                break;
        }
    }

    const resetCamera = () => {
        // 重置相机位置
        animateCamera(
            { x: 5, y: 2, z: 8 },
            { x: 0, y: 0, z: 0 },
            2000
        );
    }

    const moveToSideView = () => {
        animateCamera(
            { x: 10, y: 0, z: 0 },
            { x: 0, y: Math.PI / 2, z: 0 },
            2000
        );
    };

    const moveToFrontView = () => {
        animateCamera(
            { x: 0, y: 0, z: 10 },
            { x: 0, y: 0, z: 0 },
            2000
        );
    };

    const onKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'r':
                resetCamera();
                break;
            case '1':
                moveToFrontView();
                break;
            case '2':
                moveToSideView();
                break;
        }
        if (object) {
            const moveDistance = 0.03; // 每次按键移动的距离
            switch (event.key) {
                case 'w': // 向前移动
                    object.position.z -= moveDistance;
                    break;
                case 's': // 向后移动
                    object.position.z += moveDistance;
                    break;
                case 'a': // 向左移动
                    object.position.x -= moveDistance;
                    break;
                case 'd': // 向右移动
                    object.position.x += moveDistance;
                    break;
                case 'z':
                    object.position.y += moveDistance;
                    break;
                case 'x':
                    object.position.y -= moveDistance;
                    break;
                default:
                    break;
            }

            // 打印移动后的坐标
            console.log('Updated Object position:', object.position);
        }
    };

    const AddLabel = (position: Float32Array, color: Float32Array,
        size: Float32Array, id: number, type: LabelType) => {
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
        geometry.setAttribute('customColor', new THREE.BufferAttribute(color, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(size, 1));
        geometry.userData = { type: type, id: id };
        labelGeometries.push(geometry);

        const particles = new THREE.Points(geometry, GetLabelMaterial(type));
        particles.userData = { type: type, id: id };
        scene.add(particles);
    }

    const AddLine = (keyPoints: THREE.Vector3[], color: string,
        width: number, id: number) => {
        const curve = new THREE.CatmullRomCurve3(keyPoints);

        const points = curve.getPoints(100);
        const positions: number[] = [];
        points.forEach(point => {
            positions.push(point.x, point.y, point.z);
        });

        const geometry = new LineGeometry();
        geometry.setPositions(positions);
        geometry.userData = { type: LabelType.Curve, id: id };
        labelGeometries.push(geometry);

        const material = new LineMaterial({
            color: color,
            linewidth: width,
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
        });

        const curveObject = new Line2(geometry, material);
        curveObject.userData = { type: LabelType.Curve, id: id };

        scene.add(curveObject);
    }

    // 假设目标线的 ID 是 targetId
    const UpdateLineWidthInScene = (scene: THREE.Scene, targetId: number, scale: number) => {
        // 找到目标线条对象
        const lineToUpdate = scene.children.find(obj =>
            obj.userData.type === LabelType.Curve && obj.userData.id === targetId) as Line2;

        if (lineToUpdate) {
            // 确保线条使用的是 LineMaterial
            if (lineToUpdate.material instanceof LineMaterial) {
                // 修改线宽
                lineToUpdate.material.linewidth *= scale;
                // 标记材质需要更新
                lineToUpdate.material.needsUpdate = true;
            }
        };
    }

    const LoadLabel = () => {
        campInfos.forEach(camp => {
            AddLabel(new Float32Array([camp.position.x, camp.position.y, camp.position.z]),
                new Float32Array([1.0, 0.647, 0.0]), new Float32Array([1]), camp.id, LabelType.Point);
        });

        peakInfos.forEach(peak => {
            AddLabel(new Float32Array([peak.position.x, peak.position.y, peak.position.z]),
                new Float32Array([0.53, 0.81, 0.98]), new Float32Array([1]), peak.id, LabelType.Triangle);
        });

        AddLine([
            new THREE.Vector3(campInfos[0].position.x, campInfos[0].position.y - delta, campInfos[0].position.z),
            new THREE.Vector3(-1.54, -0.49, 2),
            new THREE.Vector3(-1.3, -0.31, 1.65),
            new THREE.Vector3(-1.06, -0.2, 1.53),
            new THREE.Vector3(campInfos[1].position.x, campInfos[1].position.y - delta, campInfos[1].position.z),
            new THREE.Vector3(-0.63, -0.03, 0.8),
            new THREE.Vector3(campInfos[2].position.x, campInfos[2].position.y - delta, campInfos[2].position.z),
            new THREE.Vector3(-0.37, 0.14, 0.22),
            new THREE.Vector3(campInfos[3].position.x, campInfos[3].position.y - delta, campInfos[3].position.z),
            new THREE.Vector3(-0.45, 0.51, -0.12),
            new THREE.Vector3(campInfos[4].position.x, campInfos[4].position.y - delta, campInfos[4].position.z),
            new THREE.Vector3(-0.8, 0.86, -0.17),
            new THREE.Vector3(peakInfos[0].position.x, peakInfos[0].position.y - 0.01, peakInfos[0].position.z)
        ], "orange", 3, 0);

        AddLine([
            new THREE.Vector3(campInfos[5].position.x, campInfos[5].position.y - delta, campInfos[5].position.z),
            new THREE.Vector3(-5.29, -0.4, 1.43),
            new THREE.Vector3(-4.92, -0.32, 0.45),
            new THREE.Vector3(campInfos[6].position.x, campInfos[6].position.y - delta, campInfos[6].position.z),
            new THREE.Vector3(-3.7, -0.2, -0.27),
            new THREE.Vector3(-2.98, -0.09, -0.79),
            new THREE.Vector3(campInfos[7].position.x, campInfos[7].position.y - delta, campInfos[7].position.z),
            new THREE.Vector3(campInfos[8].position.x, campInfos[8].position.y - delta, campInfos[8].position.z),
            new THREE.Vector3(-2, 0.23, -0.13),
            new THREE.Vector3(-1.94, 0.3, -0.19),
            new THREE.Vector3(campInfos[9].position.x, campInfos[9].position.y - delta, campInfos[9].position.z),
            new THREE.Vector3(campInfos[10].position.x, campInfos[10].position.y - delta, campInfos[10].position.z),
            new THREE.Vector3(peakInfos[0].position.x, peakInfos[0].position.y - 0.01, peakInfos[0].position.z)
        ], "orange", 3, 1);
    }

    const animateCamera = (
        targetPosition = { x: 5, y: 2, z: 8 },
        targetRotation = { x: 0, y: 0, z: 0 },
        duration = 1000  // 动画持续时间（毫秒）
    ) => {
        // 记录起始状态
        const camera = cameraRef.current!;
        const startPosition = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };
        const startRotation = {
            x: camera.rotation.x,
            y: camera.rotation.y,
            z: camera.rotation.z
        };

        const startTime = Date.now();

        const control = controlRef.current!;
        control.minDistance = 0;
        control.enabled = false;

        // 动画函数
        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);  // 0 到 1 之间的进度值

            // 使用 easeInOutCubic 缓动函数使动画更平滑
            const easing = (progress: number) => {
                return progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            };

            const t = easing(progress);

            // 更新相机位置
            camera.position.x = startPosition.x + (targetPosition.x - startPosition.x) * t;
            camera.position.y = startPosition.y + (targetPosition.y - startPosition.y) * t;
            camera.position.z = startPosition.z + (targetPosition.z - startPosition.z) * t;

            // 更新相机旋转
            camera.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * t;
            camera.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * t;
            camera.rotation.z = startRotation.z + (targetRotation.z - startRotation.z) * t;

            control.update();

            // 如果动画未完成，继续下一帧
            if (progress < 1) {
                requestAnimationFrame(animate);

            } else {
                const control = controlRef.current!;
                control.enabled = true;
                control.minDistance = 2.5;
            }
        };

        // 开始动画
        animate();
    };

    useEffect(() => {
        if (!isLoaded) return;
        if (containerRef.current) {
            // const stats = new Stats();
            // containerRef.current.appendChild(stats.dom);

            // 初始化渲染器
            InitRenderer();

            // 初始化 PMREMGenerator
            InitPmremGenerator();

            // 初始化场景
            InitScene();


            // 初始化相机
            InitCamera();

            // 初始化控制器
            InitController();

            // 添加光源
            SetupLight();

            // 初始化模型
            LoadModel();

            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('keydown', onKeyDown);
            document.addEventListener('click', onClick);
            containerRef.current.addEventListener('click', () => {
                if (!object) {
                    setDetailOpen(false);
                }
            });

            // 窗口大小调整
            window.onresize = () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            };

            // 渲染循环
            const animate = () => {
                if (control && scene && camera && renderer) {
                    control.update(); // 更新控制器
                    renderer.render(scene, camera); // 渲染场景
                }

                requestAnimationFrame(animate); // 请求下一个渲染帧
            };
            requestAnimationFrame(animate);
        }

        // 清理函数：组件卸载时清除 DOM 元素
        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = ''; // 清空容器
            }
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('pointermove', onPointerMove);
            if (renderer) {
                renderer.dispose();
            }
        };
    }, [isLoaded]);

    // 读取营地信息
    const loadInfo = async () => {
        try {
            const responseOfCamp = await fetch('/Info/campInfo.json');  // 假设文件放在 public 目录下
            const campInfos = await responseOfCamp.json();
            setCampInfos(campInfos);

            const responseOfPeak = await fetch('/Info/peakInfo.json');  // 假设文件放在 public 目录下
            const peakInfos = await responseOfPeak.json();
            setPeakInfos(peakInfos);

            const responseOfLine = await fetch('/Info/routeInfo.json');  // 假设文件放在 public 目录下
            const lineInfos = await responseOfLine.json();
            setRouteInfos(lineInfos);

            setIsLoaded(true);
        } catch (error) {
            console.error('加载营地信息失败:', error);
        }
    };

    useEffect(() => {
        loadInfo();
    }, []);

    useEffect(() => {
        if (detailOpen) {
            const timer = setTimeout(() => {
                setDetailActive(true);
            }, 100);

            // 清理定时器，避免内存泄漏
            return () => {
                clearTimeout(timer);
            };
        } else {
            setDetailActive(false);
        }
    }, [detailOpen]);


    return (
        <>
            <Meum></Meum>
            {isActive && campId !== -1 && <Popover content={<Camp name={campInfos[campId].name}
                height={campInfos[campId].height}
                info={campInfos[campId].info} />}
                color="rgba(4, 21, 39, 0.9)"
                open={isActive}
            >
                <PopoverTirgger position={position} isActive={isActive} />
            </Popover>}

            {isActive && peakId !== -1 && <Popover content={<Peak name={peakInfos[peakId].name}
                height={peakInfos[peakId].height}
                rank={peakInfos[peakId].rank}
                info={peakInfos[peakId].info} />}
                color="rgba(4, 21, 39, 0.9)"
                open={isActive}
            >
                <PopoverTirgger position={position} isActive={isActive} />
            </Popover>}

            {isActive && routeId !== -1 && <Popover content={<Route name={routeInfos[routeId].name}
                route={routeInfos[routeId].route}
                info={routeInfos[routeId].info} />}
                color="rgba(4, 21, 39, 0.9)"
                open={isActive}
            >
                <PopoverTirgger position={position} isActive={isActive} />
            </Popover>}

            <Drawer
                open={detailOpen} width="40%"
                drawerRender={() => detailPeakId != -1 ?
                    <PeakDetail isActive={detailActive}
                        id={peakInfos[detailPeakId].id}
                        name={peakInfos[detailPeakId].name}
                        height={peakInfos[detailPeakId].height}
                        rank={peakInfos[detailPeakId].rank}
                        location={peakInfos[detailPeakId].location}
                        firstClimbing={peakInfos[detailPeakId].firstClimbing}
                        summitCount={peakInfos[detailPeakId].summitCount}
                        history={peakInfos[detailPeakId].history}
                    /> :
                    detailRouteId != -1 ?
                        <RouteDetail isActive={detailActive}
                            id={routeInfos[detailRouteId].id}
                            name={routeInfos[detailRouteId].name}
                            length={routeInfos[detailRouteId].length}
                            totalSummiteers={routeInfos[detailRouteId].totalSummiteers}
                            fatalityRate={routeInfos[detailRouteId].fatalityRate}
                            deathToll={routeInfos[detailRouteId].deathToll}
                        /> : null}
                mask={false}
            />
            <ConfigProvider
                theme={{
                    token: {
                        colorBgElevated: 'rgba(4, 21, 39, 1)',
                    },
                }}
            >
                <FloatButton
                    tooltip={<div>Reset Camera</div>}
                    icon={<ReloadOutlined style={{ color: '#d8d8d8' }} />}
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        left: '40px',
                        outline: 'none'
                    }}
                    onClick={resetCamera} />
            </ConfigProvider>

            <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
        </>
    );
};

const PopoverTirgger = (props: { position: { top: number, left: number }, isActive: boolean }) => {
    return (
        <Button
            ghost={true}
            style={{
                position: 'absolute',  // 使用绝对定位
                top: `${props.position.top}px`,  // 动态设置按钮的 Y 坐标
                left: `${props.position.left}px`, // 动态设置按钮的 X 坐标
                border: 'none',
                display: props.isActive ? 'block' : 'none',
                width: '0px',
                height: '0px',
            }}
        >
        </Button>
    )
}

export default Mountain;




