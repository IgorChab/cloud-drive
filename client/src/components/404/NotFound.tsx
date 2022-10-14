import React from 'react'
import { Link } from 'react-router-dom'
import './404.css'
const NotFound = () => {
  return (
    <div className='wrapper'>
        <div className="content404">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <h4>Go to <Link to={'/'}>home</Link></h4>
        </div>
    </div>
  )
}

export default NotFound
