import React from 'react'
import ContentLoader from "react-content-loader"

function LoadingBlock() {
  return (
    <ContentLoader 
    className='product-block'
    speed={0}
    width={280}
    height={460}
    viewBox="0 0 280 460"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="-1" y="281" rx="6" ry="6" width="280" height="24" /> 
    <rect x="0" y="315" rx="6" ry="6" width="280" height="84" /> 
    <rect x="129" y="410" rx="23" ry="23" width="151" height="44" /> 
    <rect x="2" y="417" rx="6" ry="6" width="89" height="30" /> 
    <circle cx="135" cy="135" r="130" />
  </ContentLoader>
  )
}

export default LoadingBlock