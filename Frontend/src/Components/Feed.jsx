import React from 'react'
import Posts from './Posts.jsx'

export default function Feed() {
  return (
    <div className="flex-1 my-8 flex flex-col hide-scrollbar items-center">
      <Posts/>
    </div>
  )
}
