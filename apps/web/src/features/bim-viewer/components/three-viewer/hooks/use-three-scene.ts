import { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { debugLog } from '../utils/debug'
import { createClickHandler, createResizeHandler } from '../handlers'

interface UseThreeSceneOptions {
  containerRef: React.RefObject<HTMLDivElement>
  sceneRef: React.MutableRefObject<THREE.Scene | null>
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>
  controlsRef: React.MutableRefObject<OrbitControls | null>
  loaderRef: React.MutableRefObject<GLTFLoader | null>
  meshesRef: React.MutableRefObject<Map<string, THREE.Mesh>>
  resizeObserverRef: React.MutableRefObject<ResizeObserver | null>
  animationFrameRef: React.MutableRefObject<number | null>
  initializedRef: React.MutableRefObject<boolean>
  animationRunningRef: React.MutableRefObject<boolean>
  width?: number
  height?: number
  onComponentClickRef: React.MutableRefObject<((componentId: string) => void) | undefined>
}

export function useThreeScene(options: UseThreeSceneOptions) {
  const {
    containerRef,
    sceneRef,
    rendererRef,
    cameraRef,
    controlsRef,
    loaderRef,
    meshesRef,
    resizeObserverRef,
    animationFrameRef,
    initializedRef,
    animationRunningRef,
    width,
    height,
    onComponentClickRef,
  } = options

  useEffect(() => {
    if (!containerRef.current) return
    
    // 이미 초기화되었고 메시가 있으면 스킵 (React StrictMode 대응)
    if (initializedRef.current && meshesRef.current && meshesRef.current.size > 0) {
      debugLog('[ThreeViewer] 이미 초기화되었고 메시가 있습니다. 스킵합니다.', {
        meshCount: meshesRef.current.size,
      })
      return
    }
    
    // Scene이 이미 있고 메시가 있으면 재생성하지 않음
    if (sceneRef.current && meshesRef.current && meshesRef.current.size > 0) {
      debugLog('[ThreeViewer] Scene이 이미 있고 메시가 있습니다. 재생성하지 않습니다.', {
        meshCount: meshesRef.current.size,
      })
      initializedRef.current = true
      return
    }
    
    initializedRef.current = true

    const container = containerRef.current
    
    // 🔥 컨테이너 크기 계산: 전달받은 width/height 우선 사용 (이미 containerSize에서 계산됨)
    // fallback은 containerRef에서만 가져오기
    const getContainerSize = () => {
      if (width && height) {
        // 이미 계산된 containerSize 사용
        return { width, height }
      }
      // fallback: containerRef에서 직접 계산
      const rect = container.getBoundingClientRect()
      return {
        width: rect.width || container.clientWidth || 800,
        height: rect.height || container.clientHeight || 600,
      }
    }
    
    const { width: containerWidth, height: containerHeight } = getContainerSize()
    
    debugLog('[ThreeViewer] 컨테이너 크기 계산', {
      propsWidth: width,
      propsHeight: height,
      containerWidth,
      containerHeight,
      rectWidth: container.getBoundingClientRect().width,
      rectHeight: container.getBoundingClientRect().height,
    })

    // Scene 생성 (이미 있으면 재사용)
    let scene = sceneRef.current
    if (!scene) {
      scene = new THREE.Scene()
      scene.background = new THREE.Color(0x1a1a1a)
      sceneRef.current = scene
    } else {
      debugLog('[ThreeViewer] 기존 Scene 재사용')
    }

    // Camera 생성 (이미 있으면 재사용)
    let camera = cameraRef.current
    if (!camera) {
      camera = new THREE.PerspectiveCamera(
        75,
        containerWidth / containerHeight,
        0.1,
        10000,
      )
      camera.position.set(0, 10, 20)
      cameraRef.current = camera
    } else {
      // 카메라 비율 업데이트만 수행
      camera.aspect = containerWidth / containerHeight
      camera.updateProjectionMatrix()
    }

    // Renderer 생성 (이미 있으면 재사용)
    let renderer = rendererRef.current
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(containerWidth, containerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      container.appendChild(renderer.domElement)
      rendererRef.current = renderer
    } else {
      // Renderer 크기만 업데이트
      renderer.setSize(containerWidth, containerHeight)
    }

    // GLTFLoader 생성 (이미 있으면 재사용)
    if (!loaderRef.current) {
      loaderRef.current = new GLTFLoader()
    }

    // 조명 추가 (이미 있으면 스킵)
    const hasLights = scene.children.some(child => child instanceof THREE.Light)
    if (!hasLights) {
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
      scene.add(ambientLight)

      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.2)
      directionalLight1.position.set(10, 10, 10)
      scene.add(directionalLight1)

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight2.position.set(-10, 5, -10)
      scene.add(directionalLight2)
      
      // 추가 조명: 위에서 비추는 조명
      const topLight = new THREE.DirectionalLight(0xffffff, 0.6)
      topLight.position.set(0, 20, 0)
      scene.add(topLight)
    }

    // OrbitControls 추가 (이미 있으면 재사용)
    let controls = controlsRef.current
    if (!controls) {
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.enableZoom = true
      controls.enablePan = true
      controlsRef.current = controls
    }

    // 그리드 헬퍼 추가 (이미 있으면 스킵)
    const hasGridHelper = scene.children.some(child => child instanceof THREE.GridHelper)
    if (!hasGridHelper) {
      const gridHelper = new THREE.GridHelper(50, 50, 0x444444, 0x222222)
      scene.add(gridHelper)
    }

    // 축 헬퍼 추가 (이미 있으면 스킵)
    const hasAxesHelper = scene.children.some(child => child instanceof THREE.AxesHelper)
    if (!hasAxesHelper) {
      const axesHelper = new THREE.AxesHelper(10)
      scene.add(axesHelper)
    }

    // 애니메이션 루프 (한 번만 실행)
    if (!animationRunningRef.current) {
      animationRunningRef.current = true
      debugLog('[ThreeViewer] 애니메이션 루프 시작', {
        hasScene: !!sceneRef.current,
        hasCamera: !!cameraRef.current,
        hasRenderer: !!rendererRef.current,
        hasControls: !!controlsRef.current,
      })
      let frameCount = 0
      const animate = () => {
        if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !controlsRef.current) {
          debugLog('[ThreeViewer] 애니메이션 루프 중단: 필수 객체가 없음', {
            hasScene: !!sceneRef.current,
            hasCamera: !!cameraRef.current,
            hasRenderer: !!rendererRef.current,
            hasControls: !!controlsRef.current,
            frameCount,
          })
          animationRunningRef.current = false
          return
        }
        animationFrameRef.current = requestAnimationFrame(animate)
        controlsRef.current.update()
        rendererRef.current.render(sceneRef.current, cameraRef.current)
        
        // 처음 몇 프레임만 로그 출력 (초기 렌더링 확인용)
        if (frameCount < 5) {
          debugLog(`[ThreeViewer] 애니메이션 프레임 ${frameCount}: 렌더링 완료`, {
            cameraPosition: {
              x: cameraRef.current.position.x.toFixed(1),
              y: cameraRef.current.position.y.toFixed(1),
              z: cameraRef.current.position.z.toFixed(1),
            },
            target: {
              x: controlsRef.current.target.x.toFixed(1),
              y: controlsRef.current.target.y.toFixed(1),
              z: controlsRef.current.target.z.toFixed(1),
            },
            sceneChildrenCount: sceneRef.current.children.length,
            meshesCount: meshesRef.current?.size ?? 0,
          })
        }
        frameCount++
      }
      animate()
    } else {
      debugLog('[ThreeViewer] 애니메이션 루프는 이미 실행 중입니다.', {
        hasScene: !!sceneRef.current,
        hasCamera: !!cameraRef.current,
        hasRenderer: !!rendererRef.current,
        hasControls: !!controlsRef.current,
      })
    }

    // 리사이즈 핸들러
    const handleResize = createResizeHandler(container, camera, renderer, width, height)
    window.addEventListener('resize', handleResize)
    
    // ResizeObserver로 컨테이너 크기 변경 감지
    const resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    resizeObserverRef.current = resizeObserver
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    
    // 초기 크기 설정을 위한 약간의 지연
    const resizeTimeout = setTimeout(() => {
      handleResize()
    }, 100)

    // 클릭 이벤트 핸들러 (ref를 통해 최신 콜백 사용)
    const handleClick = (event: MouseEvent) => {
      const handler = createClickHandler(
        container,
        renderer,
        camera,
        scene,
        meshesRef.current,
        onComponentClickRef.current,
      )
      handler(event)
    }
    container.addEventListener('click', handleClick)

    // Cleanup (컴포넌트 언마운트 시에만 실행)
    return () => {
      clearTimeout(resizeTimeout)
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('click', handleClick)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      animationRunningRef.current = false

      // 메시가 있으면 Scene을 유지 (모델은 고정되어 있어야 함)
      // 메시가 없을 때만 정리 (컴포넌트 언마운트 시)
      if (!meshesRef.current || meshesRef.current.size === 0) {
        // Scene 정리 (메시가 없을 때만)
        if (sceneRef.current) {
          sceneRef.current.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose()
              if (Array.isArray(object.material)) {
                object.material.forEach((mat) => mat.dispose())
              } else {
                object.material.dispose()
              }
            }
          })
        }

        if (controlsRef.current) {
          controlsRef.current.dispose()
          controlsRef.current = null
        }

        if (rendererRef.current && containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
          rendererRef.current.dispose()
          rendererRef.current = null
        }

        sceneRef.current = null
        cameraRef.current = null
        initializedRef.current = false
      } else {
        // 메시가 있으면 Scene 유지 (모델은 고정)
        debugLog('[ThreeViewer] 메시가 있으므로 Scene을 유지합니다.', {
          meshCount: meshesRef.current?.size ?? 0,
        })
      }
    }
  }, [width, height])
}
