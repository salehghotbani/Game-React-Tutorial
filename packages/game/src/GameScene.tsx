import { tx, useLanguage } from '@react-quest/localization';
import { Component, Suspense, memo, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import type { GameSettings, KnowledgeRoom } from '@react-quest/shared';
import { CAMERA_CONFIG } from './config';
import { PhysicsWorld } from './physics/PhysicsWorld';
import { PlayerController } from './player/PlayerController';
import { WorldCamera } from './camera/WorldCamera';
import { Room } from './room/Room';
import type { PlayerPosition } from './player/types';
import { ArcadeMachine } from './room/ArcadeMachine';
import type { RoomLifeView } from './room/RoomLife';
import { useCameraLook } from './input/useCameraLook';
import { Neighborhood } from './world/Neighborhood';
import { WorldLighting } from './world/WorldLighting';
import { SurfaceProvider } from './materials/SurfaceMaterial';

type Props = {
  settings: GameSettings;
  life: RoomLifeView;
  timestamp: number | null;
  room?: KnowledgeRoom;
  onPosition?: (position: PlayerPosition) => void;
  arcadeUnlocked?: boolean;
  onComputerReady?: () => void;
  onTVReady?: () => void;
  onReadingReady?: () => void;
  onTravelEnd?: () => void;
  onFirstMove?: () => void;
};

const FROZEN_MODES = ['computer', 'arcade', 'reading', 'readingOnSofa', 'watching', 'gameNet'];

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="scene-error" role="alert">{tx("نمایش اتاق ممکن نشد. مرورگر را به‌روز کن و شتاب‌دهی سخت‌افزاری را فعال کن.")}<button onClick={() => window.location.reload()}>{tx("تلاش دوباره")}</button></div>;
    return this.props.children;
  }
}

function SceneReady({ onReady }: { onReady: () => void }) {
  useLanguage();
  useEffect(() => { onReady(); }, [onReady]);
  return null;
}

function SceneContent({ settings, life, room, timestamp, onPosition, onReady, arcadeUnlocked = false, onComputerReady, onTVReady, onReadingReady, onTravelEnd, onFirstMove }: Props & { onReady: () => void }) {
  useLanguage();
  const body = useRef<RapierRigidBody>(null);
  const frozen = settings.paused || FROZEN_MODES.includes(settings.mode);
  const look = useCameraLook(settings.mode === 'explore' && !settings.paused, settings.cameraView);
  const onActivityReady = () => {
    if (settings.mode === 'enteringComputer') onComputerReady?.();
    if (settings.mode === 'enteringTV') onTVReady?.();
    if (settings.mode === 'enteringReading') onReadingReady?.();
  };
  return (
    <SurfaceProvider>
      <WorldLighting timestamp={timestamp} theme={settings.themeMode} />
      <pointLight position={[0, 3.5, 0]} intensity={12} distance={12} color="#ffe2b5" />
      <pointLight position={[2.2, 3.2, -8.7]} intensity={9} distance={9} color="#ffdfb5" />
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.47,0]} receiveShadow><planeGeometry args={[24,28]}/><shadowMaterial transparent opacity={.14}/></mesh>
      <Room theme={room} life={life} timestamp={timestamp} firstPerson={settings.cameraView === 'firstPerson'}/>
      <Neighborhood settings={settings} />
      {arcadeUnlocked && <ArcadeMachine />}
      <Suspense fallback={null}>
        <PhysicsWorld paused={frozen} debug={settings.showPhysics} arcadeUnlocked={arcadeUnlocked} greenhouseOpen={life.greenhouseOpen}>
          <SceneReady onReady={onReady} />
          <PlayerController bodyRef={body} settings={settings} look={look} greenhouseOpen={life.greenhouseOpen} arcadeUnlocked={arcadeUnlocked} onTravelEnd={onTravelEnd} onFirstMove={onFirstMove} key={settings.resetToken} />
          <WorldCamera bodyRef={body} onPosition={onPosition} settings={settings} look={look} onActivityReady={onActivityReady} key={`camera-${settings.resetToken}`} />
        </PhysicsWorld>
      </Suspense>
    </SurfaceProvider>
  );
}

function GameSceneView(props: Props) {
  useLanguage();
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  return (
    <SceneBoundary>
      <Canvas frameloop={FROZEN_MODES.includes(props.settings.mode) ? 'demand' : 'always'} shadows dpr={[1, 1.5]} camera={{ fov: CAMERA_CONFIG.fov, position: [4.5, 7, 9.2], near: 0.08, far: 100 }} gl={{ antialias: true, alpha: true }} fallback={<div className="scene-error">{tx("این مرورگر از WebGL پشتیبانی نمی‌کند.")}</div>}>
        <SceneContent {...props} onReady={onReady} />
      </Canvas>
      {!ready && <div className="scene-loading-wrap" role="status"><div className="scene-loading">{tx("در حال آماده‌سازی اتاق…")}</div></div>}
    </SceneBoundary>
  );
}

export const GameScene = memo(GameSceneView);
