import React from 'react'
import {motion} from "framer-motion"
import { ColorTheme } from '@/lib/colorThemes'

const BgShapes = () => {

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 w-1/3 h-1/3 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${ColorTheme.primary}, transparent 70%)`,
          }}
          animate={{
            x: [0, 10, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-1/4 h-1/4 rounded-full opacity-10"
          style={{
            background: `radial-gradient(circle, ${ColorTheme.primary}, transparent 70%)`,
          }}
          animate={{
            x: [0, -15, 0],
            y: [0, 10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/3 left-1/6 w-1/6 h-1/6 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle, ${ColorTheme.primary}, transparent 70%)`,
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
  )
}

export default BgShapes