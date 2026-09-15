import upraxis from './upraxis'
import bim from './bim-translator'
import food from './food-ordering'
import asr from './asr'
import opengl from './opengl'
import detective from './detective-game'
import type { Project } from './types'
export const projects: Project[] = [upraxis, bim, food, asr, opengl, detective]
export const featured = projects.filter(p => p.placement === 'featured').sort((a,b) => a.order-b.order)
export const supporting = projects.filter(p => p.placement === 'supporting')
