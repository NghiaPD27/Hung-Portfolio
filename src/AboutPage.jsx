import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import './AboutPage.css'

const PARTICLES = [
  { x: 95, y: 110, size: 2.2, inset: 18.18, opacity: [0.099, 0.18, 0.1224, 0.1584, 0.099], mx: [0, 16, 42, 18, 0], my: [0, -8, -14, 7, 0], times: [0, 0.1778, 0.4444, 0.7, 1] },
  { x: 240, y: 245, size: 3.2, inset: 15.62, opacity: [0.121, 0.22, 0.1496, 0.1936, 0.121], mx: [0, 33, 65, 29, 0], my: [0, -15, 12, 2, 0], times: [0, 0.2167, 0.5444, 0.7389, 1] },
  { x: 410, y: 90, size: 1.8, inset: 16.67, opacity: [0.088, 0.16, 0.1088, 0.1408, 0.088], mx: [0, 16, 88, 40, 0], my: [0, -22, -14, -3, 0], times: [0, 0.2556, 0.4778, 0.7778, 1] },
  { x: 575, y: 330, size: 2.7, inset: 22.22, opacity: [0.11, 0.2, 0.136, 0.176, 0.11], mx: [0, 33, 53, 51, 0], my: [0, -14, 12, -8, 0], times: [0, 0.2944, 0.5778, 0.8167, 1] },
  { x: 730, y: 180, size: 3.8, inset: 18.42, opacity: [0.132, 0.24, 0.1632, 0.2112, 0.132], mx: [0, 16, 76, 24, 0], my: [0, -21, -14, 5, 0], times: [0, 0.1778, 0.5111, 0.7, 1] },
  { x: 890, y: 410, size: 2, inset: 20, opacity: [0.0935, 0.17, 0.1156, 0.1496, 0.0935], mx: [0, 33, 99, 35, 0], my: [0, -13, 12, 0, 0], times: [0, 0.2167, 0.4444, 0.7389, 1], yEase: ['easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
  { x: 1045, y: 125, size: 2.9, inset: 17.24, opacity: [0.1155, 0.21, 0.1428, 0.1848, 0.1155], mx: [0, 16, 64, 46, 0], my: [0, -20, -14, -5, 0], times: [0, 0.2556, 0.5444, 0.7778, 1] },
  { x: 1215, y: 295, size: 4, inset: 20, opacity: [0.1375, 0.25, 0.17, 0.22, 0.1375], mx: [0, 33, 87, 19, 0], my: [0, -12, 12, -10, 0], times: [0, 0.2944, 0.4778, 0.8167, 1] },
  { x: 1360, y: 205, size: 2.4, inset: 16.67, opacity: [0.1045, 0.19, 0.1292, 0.1672, 0.1045], mx: [0, 16, 52, 30, 0], my: [0, -19, -14, 3, 0], times: [0, 0.1778, 0.5778, 0.7, 1] },
  { x: 150, y: 520, size: 3.6, inset: 16.67, opacity: [0.1265, 0.23, 0.1564, 0.2024, 0.1265], mx: [0, 33, 75, 41, 0], my: [0, -11, 12, -2, 0], times: [0, 0.2167, 0.5111, 0.7389, 1] },
  { x: 320, y: 700, size: 2.1, inset: 14.29, opacity: [0.099, 0.18, 0.1224, 0.1584, 0.099], mx: [0, 16, 98, 52, 0], my: [0, -18, -14, -7, 0], times: [0, 0.2556, 0.4444, 0.7778, 1] },
  { x: 490, y: 610, size: 3, inset: 16.67, opacity: [0.11, 0.2, 0.136, 0.176, 0.11], mx: [0, 33, 63, 25, 0], my: [0, -10, 12, 6, 0], times: [0, 0.2944, 0.5444, 0.8167, 1] },
  { x: 650, y: 820, size: 1.9, inset: 15.79, opacity: [0.088, 0.16, 0.1088, 0.1408, 0.088], mx: [0, 16, 86, 36, 0], my: [0, -17, -14, 1, 0], times: [0, 0.1778, 0.4778, 0.7, 1] },
  { x: 805, y: 545, size: 3.7, inset: 18.92, opacity: [0.132, 0.24, 0.1632, 0.2112, 0.132], mx: [0, 33, 51, 47, 0], my: [0, -9, 12, -4, 0], times: [0, 0.2167, 0.5778, 0.7389, 1] },
  { x: 965, y: 760, size: 2.6, inset: 19.23, opacity: [0.1045, 0.19, 0.1292, 0.1672, 0.1045], mx: [0, 16, 74, 20, 0], my: [0, -16, -14, -9, 0], times: [0, 0.2556, 0.5111, 0.7778, 1] },
  { x: 1125, y: 590, size: 3.1, inset: 19.35, opacity: [0.121, 0.22, 0.1496, 0.1936, 0.121], mx: [0, 33, 97, 31, 0], my: [0, -8, 12, 4, 0], times: [0, 0.2944, 0.4444, 0.8167, 1] },
  { x: 1280, y: 865, size: 2.3, inset: 17.39, opacity: [0.0935, 0.17, 0.1156, 0.1496, 0.0935], mx: [0, 16, 62, 42, 0], my: [0, -15, -14, -1, 0], times: [0, 0.1778, 0.5444, 0.7, 1] },
  { x: 1390, y: 690, size: 4.1, inset: 19.51, opacity: [0.1375, 0.25, 0.17, 0.22, 0.1375], mx: [0, 33, 85, 53, 0], my: [0, -22, 12, -6, 0], times: [0, 0.2167, 0.4778, 0.7389, 1] },
]

const DANDELIONS = [
  {
    x: 75.52, y: 96, width: 40.391, height: 66.558, imageWidth: 36, imageHeight: 64.203, baseRotate: 4, blur: 0.6,
    initial: { opacity: 0, rotate: 0, x: -316, y: 0 },
    animate: { opacity: [0, 0.8, 0.8, 0, 0], rotate: [0, -10, 6, 0, 0], x: [-316, 1560, 1560], y: [0, 14, -9.8, 0, 0] },
    transition: {
      opacity: { times: [0, 0.0139, 0.8028, 0.8222, 1], ease: ['easeOut', 'linear', 'easeIn', 'linear'] },
      rotate: { times: [0, 0.2796, 0.5591, 0.8222, 1], ease: ['easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
      x: { times: [0, 0.8222, 1], ease: 'linear' },
      y: { times: [0, 0.2713, 0.5427, 0.8222, 1], ease: ['easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
    },
  },
  {
    x: 229.65, y: 185, width: 69.099, height: 92.236, imageWidth: 46, imageHeight: 82.037, baseRotate: 18, blur: 0.4,
    initial: { opacity: 0.8, rotate: -6.3, x: 1187.274, y: -10.8 },
    animate: { opacity: [0.8, 0, 0.8, 0.8, 0, 0, 0.8, 0.8], rotate: [-6.3, 5, 5, 0, -14, 5, 0, 0, -6.3], x: [1187.274, 1385, 1385, -501, 1385, 1385, -501, 1187.274], y: [-10.8, 16.8, 16.8, 0, 24, -16.8, 0, 0, -10.8] },
    transition: {
      opacity: { times: [0, 0.0722, 0.0861, 0.7417, 0.7611, 0.9278, 0.9417, 1], ease: ['easeOut', 'easeOut', 'linear', 'easeIn', 'linear', 'easeOut', 'linear'] },
      rotate: { times: [0, 0.0717, 0.0721, 0.0722, 0.3064, 0.5407, 0.7611, 0.9278, 1], ease: ['easeInOut', 'linear', 'linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear', 'easeInOut'] },
      x: { times: [0, 0.0717, 0.0721, 0.0722, 0.7611, 0.9277, 0.9278, 1], ease: 'linear' },
      y: { times: [0, 0.0717, 0.0721, 0.0722, 0.2996, 0.5269, 0.7611, 0.9278, 1], ease: ['easeInOut', 'linear', 'linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear', 'easeInOut'] },
    },
  },
  {
    x: 440, y: 282, width: 32, height: 57.069, imageWidth: 32, imageHeight: 57.069, baseRotate: 0, blur: 0.65, direct: true,
    initial: { opacity: 0, rotate: 0, x: -672, y: 0 },
    animate: { opacity: [0, 0, 0.8, 0.8, 0, 0], rotate: [0, 0, 360, 360], x: [-672, -672, 1200, 1200], y: [0, 0, 18, -12.6, 0, 0] },
    transition: {
      opacity: { times: [0, 0.2111, 0.225, 0.9583, 0.9778, 1], ease: ['linear', 'easeOut', 'linear', 'easeIn', 'linear'] },
      rotate: { times: [0, 0.2111, 0.9778, 1], ease: 'linear' },
      x: { times: [0, 0.2111, 0.9778, 1], ease: 'linear' },
      y: { times: [0, 0.2111, 0.4641, 0.7171, 0.9778, 1], ease: ['linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
    },
  },
  {
    x: 615.15, y: 365, width: 56.782, height: 95.332, imageWidth: 52, imageHeight: 92.737, baseRotate: 3, blur: 0.25,
    initial: { opacity: 0.8, rotate: -3.6, x: 892.654, y: -4.95 },
    animate: { opacity: [0.8, 0, 0.8, 0.8, 0, 0, 0.8, 0.8], rotate: [-3.6, 5, 5, 0, -8, 5, 0, 0, -3.6], x: [892.654, 1020, 1020, -872, 1020, 1020, -872, 892.654], y: [-4.95, 7.7, 7.7, 0, 11, -7.7, 0, 0, -4.95] },
    transition: {
      opacity: { times: [0, 0.0389, 0.0528, 0.5972, 0.6167, 0.9611, 0.975, 1], ease: ['easeOut', 'easeOut', 'linear', 'easeIn', 'linear', 'easeOut', 'linear'] },
      rotate: { times: [0, 0.0383, 0.0388, 0.0389, 0.2353, 0.4318, 0.6167, 0.9611, 1], ease: ['easeInOut', 'linear', 'linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear', 'easeInOut'] },
      x: { times: [0, 0.0383, 0.0388, 0.0389, 0.6167, 0.961, 0.9611, 1], ease: 'linear' },
      y: { times: [0, 0.0383, 0.0388, 0.0389, 0.2296, 0.4202, 0.6167, 0.9611, 1], ease: ['easeInOut', 'linear', 'linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear', 'easeInOut'] },
    },
  },
  {
    x: 790, y: 445.73, width: 45.065, height: 60.154, imageWidth: 30, imageHeight: 53.502, baseRotate: -18, blur: 0.7,
    initial: { opacity: 0, rotate: 0, x: -1020, y: 0 },
    animate: { opacity: [0, 0, 0.8, 0.8, 0, 0], rotate: [0, 0, 12, -4, 0, 0], x: [-1020, -1020, 850, 850], y: [0, 0, 26, -18.2, 0, 0] },
    transition: {
      opacity: { times: [0, 0.3333, 0.3472, 0.9639, 0.9833, 1], ease: ['linear', 'easeOut', 'linear', 'easeIn', 'linear'] },
      rotate: { times: [0, 0.3333, 0.5543, 0.7753, 0.9833, 1], ease: ['linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
      x: { times: [0, 0.3333, 0.9833, 1], ease: 'linear' },
      y: { times: [0, 0.3333, 0.5478, 0.7623, 0.9833, 1], ease: ['linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
    },
  },
  {
    x: 977.39, y: 548, width: 44.589, height: 76.323, imageWidth: 42, imageHeight: 74.903, baseRotate: 2, blur: 0.45,
    initial: { opacity: 0, rotate: 0, x: -1222, y: 0 },
    animate: { opacity: [0, 0, 0.8, 0.8, 0, 0], rotate: [0, 0, -6, 4, 0, 0], x: [-1222, -1222, 660, 660], y: [0, 0, 16, -11.2, 0, 0] },
    transition: {
      opacity: { times: [0, 0.1333, 0.1472, 0.6583, 0.6778, 1], ease: ['linear', 'easeOut', 'linear', 'easeIn', 'linear'] },
      rotate: { times: [0, 0.1333, 0.3184, 0.5036, 0.6778, 1], ease: ['linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
      x: { times: [0, 0.1333, 0.6778, 1], ease: 'linear' },
      y: { times: [0, 0.1333, 0.313, 0.4927, 0.6778, 1], ease: ['linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
    },
  },
  {
    x: 1147.39, y: 638, width: 45.864, height: 66.38, imageWidth: 34, imageHeight: 60.636, baseRotate: 12, blur: 0.6,
    initial: { opacity: 0, rotate: 0, x: -1394, y: 0 },
    animate: { opacity: [0, 0, 0.8, 0.8, 0, 0], rotate: [0, 0, -10, 6, 0, 0], x: [-1394, -1394, 480, 480], y: [0, 0, 20, -14, 0, 0] },
    transition: {
      opacity: { times: [0, 0.4, 0.4139, 0.9639, 0.9833, 1], ease: ['linear', 'easeOut', 'linear', 'easeIn', 'linear'] },
      rotate: { times: [0, 0.4, 0.5983, 0.7967, 0.9833, 1], ease: ['linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
      x: { times: [0, 0.4, 0.9833, 1], ease: 'linear' },
      y: { times: [0, 0.4, 0.5925, 0.785, 0.9833, 1], ease: ['linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
    },
  },
  {
    x: 323.9, y: 725, width: 54.976, height: 90.592, imageWidth: 49, imageHeight: 87.387, baseRotate: 4, blur: 0.3,
    initial: { opacity: 0, rotate: 0, x: -579, y: 0 },
    animate: { opacity: [0, 0, 0.8, 0.8, 0, 0], rotate: [0, 0, -7, 3, 0, 0], x: [-579, -579, 1310, 1310], y: [0, 0, 12, -8.4, 0, 0] },
    transition: {
      opacity: { times: [0, 0.1722, 0.1861, 0.825, 0.8444, 1], ease: ['linear', 'easeOut', 'linear', 'easeIn', 'linear'] },
      rotate: { times: [0, 0.1722, 0.4008, 0.6293, 0.8444, 1], ease: ['linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
      x: { times: [0, 0.1722, 0.8444, 1], ease: 'linear' },
      y: { times: [0, 0.1722, 0.3941, 0.6159, 0.8444, 1], ease: ['linear', 'easeInOut', 'easeInOut', 'easeInOut', 'linear'] },
    },
  },
  {
    x: 1060, y: 825, width: 38, height: 67.77, imageWidth: 38, imageHeight: 67.77, baseRotate: 0, blur: 0.3, direct: true,
    initial: { opacity: 0.8, rotate: -322.105, x: 382.316, y: -6.6 },
    animate: { opacity: [0.8, 0.8, 0, 0, 0.8, 0.8], rotate: [-322.105, -360, -360, 0, -322.105], x: [382.316, 580, 580, -1298, 382.316], y: [-6.6, 0, 0, 22, -15.4, -6.6] },
    transition: {
      opacity: { times: [0, 0.0694, 0.0889, 0.2444, 0.2583, 1], ease: ['linear', 'easeIn', 'linear', 'easeOut', 'linear'] },
      rotate: { times: [0, 0.0889, 0.2443, 0.2444, 1], ease: 'linear' },
      x: { times: [0, 0.0889, 0.2443, 0.2444, 1], ease: 'linear' },
      y: { times: [0, 0.0889, 0.2444, 0.5231, 0.8018, 1], ease: ['easeInOut', 'linear', 'easeInOut', 'easeInOut', 'easeInOut'] },
    },
  },
  {
    x: 690, y: 902.36, width: 56.958, height: 84.918, imageWidth: 44, imageHeight: 78.47, baseRotate: -10, blur: 0.3,
    initial: { opacity: 0.8, rotate: -1.5, x: 661.12, y: -4.5 },
    animate: { opacity: [0.8, 0.8, 0, 0, 0.8, 0.8], rotate: [-1.5, 0, 0, 8, -3, -1.5], x: [661.12, 950, 950, -934, 661.12], y: [-4.5, 0, 0, 15, -10.5, -4.5] },
    transition: {
      opacity: { times: [0, 0.1083, 0.1278, 0.2944, 0.3083, 1], ease: ['linear', 'easeIn', 'linear', 'easeOut', 'linear'] },
      rotate: { times: [0, 0.1278, 0.2944, 0.5778, 0.8611, 1], ease: ['easeInOut', 'linear', 'easeInOut', 'easeInOut', 'easeInOut'] },
      x: { times: [0, 0.1278, 0.2943, 0.2944, 1], ease: 'linear' },
      y: { times: [0, 0.1278, 0.2944, 0.5694, 0.8444, 1], ease: ['easeInOut', 'linear', 'easeInOut', 'easeInOut', 'easeInOut'] },
    },
  },
]

const SKILL_ICONS = [
  { file: 5, width: 53, height: 50, imageWidth: '676.06%', imageHeight: '400%', left: '-288.03%', top: '-150%' },
  { file: 4, width: 53, height: 52, imageWidth: '657.53%', imageHeight: '367.35%', left: '-278.77%', top: '-133.67%' },
  { file: 2, width: 54, height: 51, imageWidth: '576.58%', imageHeight: '339.62%', left: '-239.04%', top: '-117.92%' },
  { file: 1, width: 53, height: 47, imageWidth: '542.37%', imageHeight: '339.62%', left: '-221.19%', top: '-119.81%' },
  { file: 3, width: 52, height: 50, imageWidth: '713.75%', imageHeight: '420.23%', left: '-308.18%', top: '-159.14%' },
  { file: 6, width: 52, height: 38, imageWidth: '489.8%', imageHeight: '372.41%', left: '-194.9%', top: '-136.21%' },
  { file: 7, width: 53, height: 54, imageWidth: '716.42%', imageHeight: '397.06%', left: '-308.21%', top: '-148.53%' },
]

const withTimeline = (propertyTransition) => ({
  duration: 18,
  repeat: Infinity,
  ...propertyTransition,
})

function AirParticle({ particle, index, reducedMotion }) {
  const animate = reducedMotion
    ? { opacity: particle.opacity[0], x: 0, y: 0 }
    : {
        opacity: particle.opacity,
        x: particle.mx,
        y: particle.my,
      }

  return (
    <motion.div
      className="about-particle"
      style={{
        left: particle.x,
        top: particle.y,
        width: particle.size,
        height: particle.size,
      }}
      initial={reducedMotion ? false : { opacity: particle.opacity[0], x: 0, y: 0 }}
      animate={animate}
      transition={reducedMotion ? { duration: 0 } : {
        opacity: withTimeline({ times: particle.times, ease: 'easeInOut' }),
        x: withTimeline({ times: particle.times, ease: 'easeInOut' }),
        y: withTimeline({ times: particle.times, ease: particle.yEase || 'easeInOut' }),
      }}
      aria-hidden="true"
    >
      <img
        src={`/assets/about/particle-${String(index + 1).padStart(2, '0')}.svg`}
        alt=""
        style={{ inset: `-${particle.inset}%` }}
      />
    </motion.div>
  )
}

function Dandelion({ item, reducedMotion }) {
  const staticImage = (
    <img
      className="about-dandelion-image"
      src="/assets/about/dandelion.png"
      alt=""
      style={{
        width: item.imageWidth,
        height: item.imageHeight,
        filter: `blur(${item.blur}px)`,
        transform: `rotate(${item.baseRotate}deg)`,
      }}
    />
  )

  if (item.direct) {
    return (
      <motion.div
        className="about-dandelion about-dandelion-direct"
        style={{
          left: item.x,
          top: item.y,
          width: item.width,
          height: item.height,
        }}
        initial={reducedMotion ? false : item.initial}
        animate={reducedMotion ? { opacity: 0.8, rotate: 0, x: 0, y: 0 } : item.animate}
        transition={reducedMotion ? { duration: 0 } : Object.fromEntries(
          Object.entries(item.transition).map(([key, value]) => [key, withTimeline(value)]),
        )}
        aria-hidden="true"
      >
        {staticImage}
      </motion.div>
    )
  }

  const { opacity: initialOpacity, ...wrapperInitial } = item.initial
  const { opacity: opacityFrames, ...wrapperAnimate } = item.animate

  return (
    <motion.div
      className="about-dandelion"
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
      }}
      initial={reducedMotion ? false : wrapperInitial}
      animate={reducedMotion ? { rotate: 0, x: 0, y: 0 } : wrapperAnimate}
      transition={reducedMotion ? { duration: 0 } : {
        rotate: withTimeline(item.transition.rotate),
        x: withTimeline(item.transition.x),
        y: withTimeline(item.transition.y),
      }}
      aria-hidden="true"
    >
      <motion.div
        className="about-dandelion-visual"
        initial={reducedMotion ? false : { opacity: initialOpacity }}
        animate={reducedMotion ? { opacity: 0.8 } : { opacity: opacityFrames }}
        transition={reducedMotion ? { duration: 0 } : { opacity: withTimeline(item.transition.opacity) }}
      >
        {staticImage}
      </motion.div>
    </motion.div>
  )
}

function useArtboardLayout() {
  const getLayout = () => {
    const scale = Math.min(window.innerWidth / 1440, window.innerHeight / 900)
    const viewportWidthInArtboard = window.innerWidth / scale
    const ffWidth = Math.max(1530, viewportWidthInArtboard)

    return {
      scale,
      ffWidth,
      ffHeight: ffWidth * (900 / 1440),
      ffLeft: (1440 - ffWidth) / 2,
    }
  }
  const [layout, setLayout] = useState(getLayout)

  useEffect(() => {
    const updateLayout = () => setLayout(getLayout())
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  return layout
}

function AboutPage({ onBack }) {
  const reducedMotion = useReducedMotion()
  const layout = useArtboardLayout()

  const reveal = (delay = 0, offset = 24) => ({
    initial: reducedMotion ? false : { opacity: 0, y: offset },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] },
  })

  return (
    <main className="about-page" aria-label="About Hung Truong">
      <img className="about-viewport-background" src="/assets/about/background-sky.png" alt="" aria-hidden="true" />

      <section className="about-artboard" style={{ transform: `translate(-50%, -50%) scale(${layout.scale})` }}>
        <img
          className="about-background-layer"
          src="/assets/about/background-sky.png"
          alt=""
          aria-hidden="true"
        />

        <div className="about-atmosphere" aria-hidden="true">
          <div className="about-air-particles">
            {PARTICLES.map((particle, index) => (
              <AirParticle
                key={`particle-${index + 1}`}
                particle={particle}
                index={index}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
          {DANDELIONS.map((item, index) => (
            <Dandelion
              key={`dandelion-${index + 1}`}
              item={item}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        <motion.h1
          className="about-hello"
          initial={reducedMotion ? false : { opacity: 0, y: -34, scaleX: 0.9 }}
          animate={{ opacity: 1, y: 0, scaleX: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        >HELLO</motion.h1>
        <motion.img
          className="about-person-layer"
          src="/assets/about/hung.png"
          alt="Portrait of Hung Truong"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reducedMotion ? 0 : 1, delay: reducedMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.img
          className="about-ff-layer"
          src="/assets/about/ff.png"
          alt=""
          aria-hidden="true"
          style={{
            left: layout.ffLeft,
            width: layout.ffWidth,
            height: layout.ffHeight,
          }}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 1.1, delay: reducedMotion ? 0 : 0.18 }}
        />

        <motion.p className="about-bio" {...reveal(0.18, 28)}>
          I was born in 2004 and I’m a freelance web and visual designer based in Saigon. I enjoy traveling, photography, and turning my experiences into creative inspiration. I’m easygoing, open-minded, and always aim to create meaningful work with personality and soul.
        </motion.p>

        <motion.h2 className="about-skill-title" {...reveal(0.28, 20)}>SKILL</motion.h2>
        <div className="about-skill-icons" aria-label="Design software skills">
          {SKILL_ICONS.map((icon, index) => (
            <motion.div
              className="about-skill-icon"
              key={`skill-${index + 1}`}
              style={{ width: icon.width, height: icon.height }}
              initial={reducedMotion ? false : { opacity: 0, y: 26, scale: 0.76 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={reducedMotion ? undefined : { y: -9, scale: 1.13, rotate: index % 2 ? 4 : -4 }}
              whileTap={reducedMotion ? undefined : { scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 330, damping: 22, delay: reducedMotion ? 0 : 0.34 + index * 0.055 }}
            >
              <img
                src={`/assets/about/skill-${icon.file}.png`}
                alt=""
                style={{
                  width: icon.imageWidth,
                  height: icon.imageHeight,
                  left: icon.left,
                  top: icon.top,
                }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div className="about-education" {...reveal(0.44, 30)}>
          <div className="about-education-copy">
            <h2>EDUCATION</h2>
            <p>12/12</p>
            <p>Van Hien University 2022 -2027</p>
            <p>English B2</p>
          </div>
        </motion.div>

        <motion.div
          className="about-name"
          initial={reducedMotion ? false : { opacity: 0, x: -42 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.9, delay: reducedMotion ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="about-name-copy">
            <span>I’M</span>
            <span>HUNG TRUONG</span>
          </div>
        </motion.div>

        <motion.button
          className="about-back"
          type="button"
          onClick={onBack}
          aria-label="Back to portfolio"
          whileHover={reducedMotion ? undefined : { x: -7, scale: 1.1 }}
          whileTap={reducedMotion ? undefined : { scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24 }}
        >
          <img src="/assets/about/back-arrow-a.svg" alt="" />
        </motion.button>
      </section>
    </main>
  )
}

export default AboutPage
