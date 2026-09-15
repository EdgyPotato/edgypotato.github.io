import { assemblyPoint, easeStage, outlinePoints, projectPoint, type AssemblyFace, type Point3 } from './hardware'

// Use the same camera and per pixel depth when a GPU context is unavailable.
export function createSoftwareHardwareRenderer(canvas: HTMLCanvasElement, faces: AssemblyFace[]) {
  const context = canvas.getContext('2d')
  if (!context) return
  let frame: ImageData | undefined
  let depths = new Float32Array(0)
  function draw(progress: number, width: number, height: number) {
    if (!context || !width || !height) return
    if (!frame || frame.width !== canvas.width || frame.height !== canvas.height) {
      frame = context.createImageData(canvas.width, canvas.height)
      depths = new Float32Array(canvas.width * canvas.height)
    }
    const pixels = frame.data, colors = new Uint32Array(frame.data.buffer), w = frame.width, h = frame.height
    const pack = (color: number) => (255 << 24) | ((color & 255) << 16) | (color & 0xff00) | (color >> 16)
    pixels.fill(0)
    depths.fill(-Infinity)
    const unit = Math.min(width / 10.5, height / 8)
    const project = (point: Point3): Point3 => {
      const [x,y,z] = projectPoint(point)
      return [(width / 2 + x * unit) * w / width, (height / 2 - y * unit) * h / height, z]
    }
    const put = (x: number, y: number, z: number, color: number, coverage: number) => {
      if (x < 0 || y < 0 || x >= w || y >= h || coverage <= 0) return
      const index = y * w + x
      if (z < depths[index]!) return
      const offset=index*4, oldAlpha=pixels[offset+3]!/255
      const alpha=coverage+oldAlpha*(1-coverage)
      const blend=(value: number, old: number) => Math.round((value*coverage+old*oldAlpha*(1-coverage))/alpha)
      pixels[offset]=blend(color>>16,pixels[offset]!)
      pixels[offset+1]=blend((color>>8)&255,pixels[offset+1]!)
      pixels[offset+2]=blend(color&255,pixels[offset+2]!)
      pixels[offset+3]=Math.round(alpha*255)
    }
    const triangle = (a: Point3, b: Point3, c: Point3, color: number) => {
      const denominator = (b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
      if (Math.abs(denominator) < .00001) return
      const left = Math.max(0,Math.floor(Math.min(a[0],b[0],c[0])))
      const right = Math.min(w-1,Math.ceil(Math.max(a[0],b[0],c[0])))
      const top = Math.max(0,Math.floor(Math.min(a[1],b[1],c[1])))
      const bottom = Math.min(h-1,Math.ceil(Math.max(a[1],b[1],c[1])))
      const ux=(b[1]-c[1])/denominator, uy=(c[0]-b[0])/denominator
      const vx=(c[1]-a[1])/denominator, vy=(a[0]-c[0])/denominator
      const zx=ux*(a[2]-c[2])+vx*(b[2]-c[2])
      const packed=pack(color)
      for (let y=top;y<=bottom;y++) {
        let u=ux*(left+.5-c[0])+uy*(y+.5-c[1])
        let v=vx*(left+.5-c[0])+vy*(y+.5-c[1])
        let z=c[2]+u*(a[2]-c[2])+v*(b[2]-c[2])
        let index=y*w+left
        for(let x=left;x<=right;x++,index++,u+=ux,v+=vx,z+=zx) {
          if(u>=0 && v>=0 && u+v<=1 && z>=depths[index]!) {
            depths[index]=z
            colors[index]=packed
          }
        }
      }
    }
    const line = (a: Point3,b: Point3,color: number) => {
      const steep=Math.abs(b[1]-a[1])>Math.abs(b[0]-a[0])
      const axis=steep?1:0, other=steep?0:1
      const start=a[axis]<=b[axis]?a:b, end=start===a?b:a
      const length=end[axis]-start[axis]
      if(length<.0001) return
      for(let coordinate=Math.ceil(start[axis]);coordinate<=Math.floor(end[axis]);coordinate++) {
        const t=(coordinate-start[axis])/length
        const value=start[other]+(end[other]-start[other])*t
        const low=Math.floor(value), fraction=value-low
        const z=start[2]+(end[2]-start[2])*t+.012
        put(steep?low:coordinate,steep?coordinate:low,z,color,1-fraction)
        put(steep?low+1:coordinate,steep?coordinate:low+1,z,color,fraction)
      }
    }
    const projected = faces.flatMap(face => {
      const amount = easeStage(progress,face.start)
      return amount <= 0 ? [] : [{points:face.points.map(point => project(assemblyPoint(point,amount))),color:parseInt(face.tone.slice(1),16),edge:face.glass ? 0x708aa8 : 0x253449}]
    })
    for(const face of projected) {
      triangle(face.points[0]!,face.points[1]!,face.points[2]!,face.color)
      triangle(face.points[0]!,face.points[2]!,face.points[3]!,face.color)
    }
    for(const face of projected) for(let i=0;i<4;i++) line(face.points[i]!,face.points[(i+1)%4]!,face.edge)
    const outline=outlinePoints(progress).map(project)
    for(let i=1;i<outline.length;i++) line(outline[i-1]!,outline[i]!,0x7aa2ff)
    context.putImageData(frame,0,0)
  }
  return {draw, dispose() { frame=undefined; depths=new Float32Array(0) }}
}
