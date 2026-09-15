import { outlinePoints, projectPoint, type AssemblyFace, type Point3 } from './hardware'

// Static geometry stays on the GPU. Only scroll progress and viewport uniforms change.
export function createHardwareRenderer(canvas: HTMLCanvasElement, faces: AssemblyFace[]) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true })
  if (!gl) return
  const vertex = gl.createShader(gl.VERTEX_SHADER)!
  gl.shaderSource(vertex, `
    attribute vec3 position, color;
    attribute vec2 normal;
    attribute float start, edge;
    uniform float progress, unit, halfWidth;
    uniform vec2 viewport;
    varying vec3 tint;
    varying float side;
    void main() {
      side=edge;
      tint=color;
      float t=clamp((progress-start)*10.0,0.0,1.0);
      float amount=t*t*(3.0-2.0*t);
      if(amount<=0.0) { gl_Position=vec4(2.0,2.0,2.0,1.0); return; }
      float lift=(1.0-amount)*1.4;
      vec2 screen=(position.xy+vec2(0.0,lift))*unit*2.0/viewport+normal*halfWidth*2.0/viewport;
      gl_Position=vec4(screen,-(position.z+lift)/20.0,1.0);
    }`)
  gl.compileShader(vertex)
  const fragment = gl.createShader(gl.FRAGMENT_SHADER)!
  // Strokes carry their own coverage: the outer device pixel of each quad fades to zero, so edges resolve smoothly.
  gl.shaderSource(fragment, 'precision mediump float; varying vec3 tint; varying float side; uniform float lineMode, coverage; void main(){ float alpha=lineMode>.5 ? clamp(coverage*(1.0-abs(side)),0.0,1.0) : 1.0; gl_FragColor=vec4(tint,alpha); }')
  gl.compileShader(fragment)
  const program = gl.createProgram()!
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment)
    return
  }
  gl.useProgram(program)
  const buffer=gl.createBuffer()!, outlineBuffer=gl.createBuffer()!
  const attributes=[['position',3,0],['color',3,12],['start',1,24],['normal',2,28],['edge',1,36]] as const
  const locations=attributes.map(([name,size,offset]) => ({location:gl.getAttribLocation(program,name),size,offset}))
  const bind=(target: WebGLBuffer) => {
    gl.bindBuffer(gl.ARRAY_BUFFER,target)
    for(const {location,size,offset} of locations) {
      gl.enableVertexAttribArray(location)
      gl.vertexAttribPointer(location,size,gl.FLOAT,false,40,offset)
    }
  }
  const put=(data: number[], point: Point3, color: number, start: number, nx=0, ny=0, side=0) => {
    data.push(...projectPoint(point),(color>>16)/255,((color>>8)&255)/255,(color&255)/255,start,nx,ny,side)
  }
  // Each segment becomes a quad one pixel wider than the stroke, and the shader fades that margin to zero.
  const line=(data: number[],a: Point3,b: Point3,color: number,start: number) => {
    const p=projectPoint(a), q=projectPoint(b)
    const dx=q[0]-p[0], dy=q[1]-p[1], length=Math.hypot(dx,dy)||1
    const nx=-dy/length, ny=dx/length
    for(const [point,side] of [[a,1],[a,-1],[b,1],[b,1],[a,-1],[b,-1]] as const) put(data,point,color,start,nx*side,ny*side,side)
  }
  const data: number[]=[]
  for(const face of faces) for(const index of [0,1,2,0,2,3]) put(data,face.points[index]!,parseInt(face.tone.slice(1),16),face.start)
  const fillCount=data.length/10
  for(const face of faces) for(let i=0;i<4;i++) line(data,face.points[i]!,face.points[(i+1)%4]!,face.glass?0x708aa8:0x253449,face.start)
  const totalCount=data.length/10
  bind(buffer)
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW)
  const progressUniform=gl.getUniformLocation(program,'progress')
  const viewportUniform=gl.getUniformLocation(program,'viewport')
  const unitUniform=gl.getUniformLocation(program,'unit')
  const halfWidthUniform=gl.getUniformLocation(program,'halfWidth')
  const coverageUniform=gl.getUniformLocation(program,'coverage')
  const lineModeUniform=gl.getUniformLocation(program,'lineMode')
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.enable(gl.BLEND)
  gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0,0,0,0)
  function draw(progress: number,width: number,height: number) {
    if(!gl || !width || !height || gl.isContextLost()) return
    gl.viewport(0,0,canvas.width,canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
    gl.uniform1f(progressUniform,progress)
    gl.uniform2f(viewportUniform,width,height)
    gl.uniform1f(unitUniform,Math.min(width/10.5,height/8))
    // Hold the stroke near one CSS pixel whatever the supersample factor, plus a one pixel coverage margin.
    const scale=canvas.width/width
    const coverage=.5*scale+.5
    gl.uniform1f(coverageUniform,coverage)
    gl.uniform1f(halfWidthUniform,coverage/scale)
    bind(buffer)
    gl.uniform1f(lineModeUniform,0)
    gl.enable(gl.POLYGON_OFFSET_FILL)
    gl.polygonOffset(1,1)
    gl.drawArrays(gl.TRIANGLES,0,fillCount)
    gl.disable(gl.POLYGON_OFFSET_FILL)
    gl.uniform1f(lineModeUniform,1)
    gl.depthMask(false)
    gl.drawArrays(gl.TRIANGLES,fillCount,totalCount-fillCount)
    const points=outlinePoints(progress), outline: number[]=[]
    for(let i=1;i<points.length;i++) if(Math.hypot(points[i]![0]-points[i-1]![0],points[i]![1]-points[i-1]![1])>.00001) line(outline,points[i-1]!,points[i]!,0x7aa2ff,-1)
    if(outline.length) {
      bind(outlineBuffer)
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(outline),gl.DYNAMIC_DRAW)
      gl.drawArrays(gl.TRIANGLES,0,outline.length/10)
    }
    gl.depthMask(true)
  }
  return {draw,dispose() {gl.deleteBuffer(buffer);gl.deleteBuffer(outlineBuffer);gl.deleteProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment)}}
}
