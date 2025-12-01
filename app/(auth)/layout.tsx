import React from 'react'

const layout = ({children} : any) => {
  return (
    <div className='flex items-center justify-center h-screen main-bg-noise'>
        {children}
    </div>
  )
}

export default layout
