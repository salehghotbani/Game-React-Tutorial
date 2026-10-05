import { tx, useLanguage } from '@react-quest/localization';
import { useRef } from 'react';
import { Html, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import type { Vector3Tuple } from '@react-quest/shared';
import { ROOM_SPOTS } from '../config';
import { RoomClock } from '../world/RoomClock';
import { SurfaceMaterial } from '../materials/SurfaceMaterial';

export type RoomLifeView = {blooms:number;drops:number;cards:number;television:boolean;keyEarned:boolean;keyCollected:boolean;greenhouseOpen:boolean;watering:boolean;wateringSpot?:'plant'|'greenhouse';activeSpot?:string;onNavigate?:(id:keyof typeof ROOM_SPOTS)=>void};
function Solid({position,size,color,rotation}:{position:Vector3Tuple;size:Vector3Tuple;color:string;rotation?:Vector3Tuple}) {
  useLanguage();
  return <RoundedBox position={position} rotation={rotation} args={size} radius={Math.min(.045,...size.map(n=>n/4))} smoothness={2} castShadow receiveShadow><SurfaceMaterial color={color}/></RoundedBox>;
}
function Flower({position,color,scale=1}:{position:Vector3Tuple;color:string;scale?:number}) {
  useLanguage();
  return <group position={position} scale={scale}>
    <mesh position={[0,-.19,0]} castShadow><cylinderGeometry args={[.015,.022,.38,6]}/><meshStandardMaterial color="#4e8062"/></mesh>
    {[0,1,2,3,4].map(i=><mesh key={i} position={[Math.sin(i*1.257)*.095,0,Math.cos(i*1.257)*.095]} scale={[.075,.042,.11]} rotation={[0,i*1.257,0]} castShadow><sphereGeometry args={[1,8,6]}/><meshStandardMaterial color={color} roughness={.7}/></mesh>)}
    <mesh position={[0,.025,0]}><sphereGeometry args={[.047,8,6]}/><meshStandardMaterial color="#f9d18b"/></mesh>
  </group>;
}
export function BloomingGarden({blooms,watering,position=[3.95,0,2.65]}:{blooms:number;watering:boolean;position?:Vector3Tuple}) {
  useLanguage();
  const foliage=useRef<Group>(null),water=useRef<Group>(null),elapsed=useRef(0);
  useFrame(({clock},delta)=>{
    if(foliage.current)foliage.current.rotation.z=Math.sin(clock.elapsedTime*.9)*.025;
    if(water.current){elapsed.current=watering?elapsed.current+delta:0;water.current.children.forEach((drop,i)=>{drop.position.y=1.65-((elapsed.current*1.9+i*.15)%1.0);drop.position.x=Math.sin(i*1.8)*.2;drop.position.z=Math.cos(i*1.8)*.2;});}
  });
  return <group position={position}>
    <mesh position={[0,.3,0]} castShadow receiveShadow><cylinderGeometry args={[.35,.24,.6,20]}/><meshStandardMaterial color="#c58165" roughness={.85}/></mesh>
    <mesh position={[0,.6,0]}><cylinderGeometry args={[.34,.34,.07,20]}/><meshStandardMaterial color="#764e3a"/></mesh>
    <group ref={foliage}>
      <mesh position={[0,1.05,0]}><cylinderGeometry args={[.024,.03,.95,8]}/><meshStandardMaterial color="#597e50"/></mesh>
      {Array.from({length:8},(_,i)=><mesh key={i} position={[Math.sin(i*2.4)*.23,.85+i*.075,Math.cos(i*2.4)*.23]} rotation={[.6,i*2.4,-.6]} scale={[.17,.32,.065]} castShadow><sphereGeometry args={[1,8,6]}/><meshStandardMaterial color={blooms?'#5f9869':'#769179'}/></mesh>)}
      {Array.from({length:Math.min(6,blooms)},(_,i)=><Flower key={i} position={[Math.sin(i*2.4)*.3,1.4+(i%3)*.17,Math.cos(i*2.4)*.3]} color={['#edaaae','#f5d17f','#b2a8df'][i%3]!} scale={.9+Math.min(blooms,54)/180}/>)}
    </group>
    {watering&&<><group ref={water}>{Array.from({length:9},(_,i)=><mesh key={i} scale={[.026,.064,.026]}><sphereGeometry args={[1,6,6]}/><meshStandardMaterial color="#88e0df" emissive="#3a9599" emissiveIntensity={.3}/></mesh>)}</group><group position={[-.6,1.25,0]} rotation={[0,0,-.5]}><mesh><cylinderGeometry args={[.15,.15,.25,12]}/><meshStandardMaterial color="#6caaaa"/></mesh><mesh position={[.22,.04,0]} rotation={[0,0,-1]}><cylinderGeometry args={[.04,.05,.35,8]}/><meshStandardMaterial color="#6caaaa"/></mesh><mesh position={[-.14,0,0]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.16,.025,6,12]}/><meshStandardMaterial color="#6caaaa"/></mesh></group></>}
  </group>;
}
function Marker({id,position,label,ready,view}:{id:keyof typeof ROOM_SPOTS;position:Vector3Tuple;label:string;ready:boolean;view:RoomLifeView}) {
  useLanguage();
  return <Html position={position} center zIndexRange={[9,0]}><button className={`room-marker ${ready?'ready':'locked'} ${view.activeSpot===id?'selected':''}`} aria-label={tx(`رفتن به ${label}`)} onClick={()=>view.onNavigate?.(id)}><span>{tx(ready?'✦':'◇')}</span>{tx(label)}</button></Html>;
}
function KnowledgeShelf({ cards }: { cards: number }) {
  const shelfHeight = 1.78;
  const shelfThickness = 0.06;
  const bookHeight = 0.28;
  return <group position={[-2.6, 0, -11.82]}>
    <Solid position={[0, shelfHeight, 0]} size={[1.45, shelfThickness, 0.34]} color="#ba946f" />
    {[-0.48, 0.48].map(x => <Solid key={x} position={[x, shelfHeight - 0.16, -0.04]} size={[0.055, 0.26, 0.24]} color="#876950" />)}
    {Array.from({ length: Math.min(8, cards) }, (_, index) => <Solid key={index}
      position={[-0.59 + index * 0.15, shelfHeight + shelfThickness / 2 + bookHeight / 2, 0]}
      size={[0.1, bookHeight, 0.16]} color={['#8bb9b0', '#dbb08c', '#a59cc5'][index % 3]!} />)}
  </group>;
}
export function LivingRoomDetails({view, timestamp}: {view:RoomLifeView; timestamp: number | null}) {
  useLanguage();
  return <>
    <group position={[-2.65,0,.35]}>
      <Solid position={[0,.45,0]} size={[.86,.12,1.3]} color="#d4ab7d"/>
      {[-.28,.28].flatMap(x=>[-.48,.48].map(z=><Solid key={`${x}-${z}`} position={[x,.21,z]} size={[.07,.42,.07]} color="#886b52"/>))}
      <Solid position={[0,.55,-.2]} size={[.43,.045,.55]} color="#f4e8cb" rotation={[0,.12,0]}/><Solid position={[0,.52,-.2]} size={[.47,.026,.59]} color="#568c80" rotation={[0,.12,0]}/>
      <mesh position={[.17,.61,.32]} castShadow><cylinderGeometry args={[.08,.07,.21,12]}/><meshStandardMaterial color="#eee4cd"/></mesh>
    </group>
    <group position={[2.5,0,-9.4]} rotation={[0,Math.PI,0]}>
      <Solid position={[0,.52,0]} size={[.84,.24,.88]} color="#7b9c98"/><Solid position={[0,.9,-.34]} size={[.84,.65,.2]} color="#658b89"/>
      {[-1,1].map(side=><Solid key={side} position={[side*.44,.67,0]} size={[.13,.25,.92]} color="#5c7b72"/>)}
      {[-.3,.3].flatMap(x=>[-.3,.3].map(z=><Solid key={`${x}-${z}`} position={[x,.2,z]} size={[.07,.4,.07]} color="#725f49"/>))}
      <Solid position={[0,.74,-.17]} size={[.45,.24,.3]} color="#e1c59a" rotation={[.25,0,0]}/>
    </group>
    <group position={[3.4,0,-11.5]}>
      <Solid position={[0,.46,0]} size={[2.2,.59,.56]} color="#ae8764"/>
      {[-.7,0,.7].map(x=><Solid key={x} position={[x,.45,.286]} size={[.64,.36,.025]} color="#bf9b75"/>)}
      <Solid position={[0,1.48,0]} size={[2.0,1.17,.12]} color="#29383c"/>
      <mesh position={[0,1.48,.066]}><planeGeometry args={[1.87,1.04]}/><meshStandardMaterial color={view.television?'#254e56':'#35423f'} emissive={view.television?'#357b83':'#223833'} emissiveIntensity={.45}/></mesh>
      <mesh position={[0,1.49,.09]} rotation={[0,0,-Math.PI/2]}><coneGeometry args={[.17,.28,3]}/><meshBasicMaterial color={view.television?'#b7dfc1':'#647a72'}/></mesh>
      <Solid position={[0,.99,0]} size={[.07,.38,.07]} color="#384747"/><Solid position={[0,.8,.03]} size={[.55,.055,.22]} color="#384747"/>
      <Solid position={[-.78,.81,.06]} size={[.11,.025,.27]} color="#354542"/>
    </group>
    <group position={[2.7,0,-2.9]}>
      <Solid position={[0,.93,0]} size={[.82,.09,.66]} color="#d1a47a"/>
      {[-.31,.31].map(x=><Solid key={x} position={[x,.45,0]} size={[.09,.9,.5]} color="#8c795c"/>)}
      <Solid position={[0,1,0]} size={[.5,.025,.32]} color="#e6d0a6"/>
      {view.keyEarned&&!view.keyCollected&&<group position={[0,1.09,0]} rotation={[Math.PI/2,0,-.3]}><mesh><torusGeometry args={[.09,.025,8,20]}/><meshStandardMaterial color="#e3b85c" metalness={.65} roughness={.25}/></mesh><Solid position={[.15,0,0]} size={[.24,.045,.035]} color="#e3b85c"/><Solid position={[.23,-.04,0]} size={[.035,.09,.035]} color="#e3b85c"/></group>}
    </group>
    <RoomClock timestamp={timestamp} position={[0.85,2.15,-11.92]} />
    <KnowledgeShelf cards={view.cards} />
    <Marker id="books" position={[3.65,2.85,-4.35]} label={tx("کتاب‌های React")} ready view={view}/>
    <Marker id="computer" position={[-1.5,3,-3.8]} label={tx("کامپیوتر · آموزش React")} ready view={view}/>
    <Marker id="sofa" position={[-3.95,2.1,0]} label={tx("مطالعه روی مبل")} ready view={view}/>
    <Marker id="plant" position={[3.95,2.12,2.65]} label={tx("باغچهٔ یادگیری")} ready={view.drops>0} view={view}/>
    <Marker id="television" position={[3.4,2.45,-11.4]} label={tx("سینمای React")} ready={view.television} view={view}/>
    {view.keyEarned&&!view.keyCollected&&<Marker id="key" position={[2.7,1.65,-2.9]} label={tx("کلید گلخانه")} ready view={view}/>}
  </>;
}
export function Greenhouse({view}:{view:RoomLifeView}) {
  useLanguage();
  const door=useRef<Group>(null);
  useFrame((_,delta)=>{if(door.current)door.current.rotation.y+=((view.greenhouseOpen?1.55:0)-door.current.rotation.y)*(1-Math.exp(-4*delta));});
  return <>
    <group position={[5.03,0,-1.32]}>
      <group ref={door}>
        <Solid position={[0,1.25,1.32]} size={[.14,2.5,2.64]} color="#557f74"/>
        <Solid position={[-.09,1.5,1.32]} size={[.025,1.2,2.2]} color="#94b8a2"/>
        <mesh position={[-.12,1.05,2.28]} rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.045,.045,.18,12]}/><meshStandardMaterial color="#e3c17c" metalness={.65}/></mesh>
      </group>
      <Solid position={[0,2.64,1.32]} size={[.25,.2,2.92]} color="#ddc9a3"/>
      {[0,2.64].map(z=><Solid key={z} position={[0,1.32,z]} size={[.25,2.64,.14]} color="#ddc9a3"/>)}
    </group>
    <Marker id="door" position={[4.98,3.05,0]} label={tx(view.greenhouseOpen?'درِ گلخانه':view.keyCollected?'باز کردن گلخانه':'گلخانهٔ قفل‌شده')} ready={view.keyCollected} view={view}/>
    <group position={[7.5,0,0]}>
      <Solid position={[0,-.22,0]} size={[5,.44,6.3]} color="#b6a88b"/>
      {Array.from({length:10},(_,i)=><Solid key={i} position={[-2.25+i*.5,.01,0]} size={[.49,.035,6]} color={i%2?'#d9c8a8':'#e0d2b5'}/>)}
      <Solid position={[2.6,.25,0]} size={[.18,.5,6.3]} color="#b4c5b2"/>
      <Solid position={[0,1.5,-3.1]} size={[5.2,3,.15]} color="#b7cdbb"/>
      {[-2.3,-1.15,0,1.15,2.3].map(x=><Solid key={x} position={[x,1.7,-2.99]} size={[.045,2.4,.04]} color="#e3edda"/>)}
      <Solid position={[0,1.7,-2.96]} size={[4.7,.04,.04]} color="#e3edda"/>
      <Solid position={[0,.22,3.1]} size={[5.2,.44,.15]} color="#b7cdbb"/>
      <Solid position={[1.9,.52,0]} size={[.8,.94,4.6]} color="#ba8b63"/>
      <Solid position={[1.9,1.0,0]} size={[.73,.03,4.48]} color="#594b35"/>
      {[-1.7,-.6,.6,1.7].map((z,i)=><BloomingGarden key={z} position={[1.9,.94,z]} blooms={view.greenhouseOpen?Math.max(0,Math.ceil((view.blooms-i)/4)):0} watering={view.watering&&view.wateringSpot==='greenhouse'&&i===(view.blooms-1)%4}/>)}
      <Solid position={[-.2,.64,-2.4]} size={[2,.12,.7]} color="#d4ac7e"/>
      {[-.95,.55].map(x=><Solid key={x} position={[x,.3,-2.4]} size={[.12,.6,.6]} color="#b28c67"/>)}
      <Solid position={[-.2,.025,.15]} size={[2.7,.04,2.4]} color="#c2caaa"/>
      <pointLight position={[0,3,-1.5]} intensity={3} distance={7} color="#c6edce"/>
      {view.greenhouseOpen&&<Marker id="greenhouse" position={[-.25,1.15,0]} label={tx("باغچهٔ گلخانه")} ready={view.drops>0} view={view}/>}
    </group>
  </>;
}
