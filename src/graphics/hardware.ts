export type Point3 = readonly [number, number, number]
export interface AssemblyFace { points: Point3[]; start: number; tone: string; glass: boolean }

// Stylized motherboard with a CPU socket, DIMMs, I/O blocks and a finned cooler.
export function createHardware(): AssemblyFace[] {
  const faces: AssemblyFace[] = []
  function block(x: number, y: number, z: number, w: number, d: number, h: number, start: number, glass = false) {
    const a: Point3 = [x,y,z], b: Point3 = [x+w,y,z], c: Point3 = [x+w,y+d,z], e: Point3 = [x,y+d,z]
    const top = ([px,py,pz]: Point3): Point3 => [px,py,pz+h]
    faces.push(
      { points:[b,c,top(c),top(b)], start, tone:glass ? '#34506a' : '#53657b', glass },
      { points:[c,e,top(e),top(c)], start, tone:glass ? '#263c51' : '#8798ae', glass },
      { points:[top(a),top(b),top(c),top(e)], start, tone:glass ? '#86b0da' : '#c2cedc', glass },
    )
  }
  block(-3.1,-2.35,0,6.2,4.7,.14,.08,true)
  // Copper routes share the board surface and terminate at component footprints. Few and wide: a route thinner
  // than a couple of pixels cannot resolve at the size this illustration is drawn.
  for(let i=0;i<5;i++) {
    block(-2.7,-1.65+i*.29,.145,1.8,.05,.012,.22+i*.01,true)
    block(-.92,-1.65+i*.29,.145,.05,1+i*.14,.012,.24+i*.01,true)
    block(.5,-1.7+i*.36,.145,1.2,.05,.012,.24+i*.01,true)
  }
  block(-1.05,-.85,.15,1.9,1.9,.18,.38)
  block(-.86,-.66,.33,1.52,1.52,.12,.5,true)
  block(-.65,-.45,.45,1.1,1.1,.1,.61)
  // Two upright DIMMs with individual packages and retaining clips.
  for(let row=0;row<2;row++) {
    const x=1.35+row*.55
    block(x,-1.75,.15,.24,3.15,.18,.44+row*.035)
    block(x+.065,-1.66,.33,.11,2.96,.88,.58+row*.035,true)
    for(let chip=0;chip<4;chip++) block(x+.17,-1.5+chip*.7,.49,.1,.5,.48,.58+row*.035)
    for(const y of [-1.8,1.38]) block(x-.04,y,.15,.32,.16,.4,.44+row*.035)
  }
  // Rear I/O, power stages, expansion slots and board-level controllers.
  for(let i=0;i<4;i++) {
    block(-2.94,-1.85+i*.87,.15,.62,.68,.65,.4+i*.025)
    block(-2.3,-1.7+i*.5,.15,.27,.32,.35,.4+i*.025)
  }
  for(let i=0;i<2;i++) block(-1.6,1.5+i*.36,.15,2.5,.16,.24,.59+i*.03)
  block(2.45,-1.7,.15,.35,1.45,.4,.64)
  for(let i=0;i<4;i++) block(2.47,-1.6+i*.32,.55,.29,.14,.04,.64)
  block(.25,-1.95,.15,.64,.57,.18,.65)
  block(-1.85,.65,.15,.45,.45,.17,.66)
  // The cooler settles onto the CPU last. Six wide fins read cleanly where ten narrow ones aliased into a comb.
  block(-.92,-.73,.55,1.64,1.64,.13,.73)
  for(let i=0;i<6;i++) block(-.9+i*.306,-.71,.68,.11,1.6,.78,.84+i*.01)
  return faces
}
export function easeStage(progress: number, start: number, duration = .1) {
  const t = Math.max(0,Math.min(1,(progress-start)/duration))
  return t*t*(3-2*t)
}
export function projectPoint([x,y,z]: Point3): Point3 {
  return [(x-y)*.866, z-(x+y)*.5-.45, x+y+z]
}
export function assemblyPoint([x,y,z]: Point3, amount: number): Point3 {
  return [x,y,z+(1-amount)*1.4]
}
// Draw a single continuous stroke around the printed circuit board footprint.
export function outlinePoints(progress: number): Point3[] {
  if (progress <= 0) return []
  const corners: Point3[] = [[-3.1,-2.35,0],[3.1,-2.35,0],[3.1,2.35,0],[-3.1,2.35,0],[-3.1,-2.35,0]]
  const length = easeStage(progress,0,.2)*4
  const points = corners.slice(0,Math.floor(length)+1)
  if(length<4) {
    const i=Math.floor(length), t=length-i, a=corners[i]!, b=corners[i+1]!
    points.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,0])
  }
  return points
}
