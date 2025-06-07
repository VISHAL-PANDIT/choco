"use client"
import React from 'react'

const CLientProducts = () => {
  return (
    <section className='bg-[#f5f5f5] px-5 py-14 md:py-20'>
        <div className='mx-auto max-w-6xl'>
            <div className="flex items-center justify-center gap-5">
                <div className='h-[2px] bg-amber-900 w-[30%]'/>
                <h2 className="text-3xl font-bold tracking-tight text-amber-900">
                    Special Products
                </h2>
                <div className='h-[2px] bg-amber-900 w-[30%]'/>
            </div>
            <div className='mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>

            </div>
        </div>
    </section>
  )
}

export default CLientProducts