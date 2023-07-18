// @ts-expect-error because React is a necessary unused import
import React, { useEffect, useState } from 'react'

export default function Introduction (): JSX.Element {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    setIsMobile(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent))
  }, [])

  return (
    <div>
      <p>
        Welcome to our web application focusing on cross-species brain
        similarity! Gain valuable insights into the intriguing parallels between
        human and macaque brains. Designed for scientists, students, and curious
        minds alike, our user-friendly interface enables effortless navigation
        through the realm of cross-species brain similarity. Want a more
        detailed in-depth explanation of this project? Take a look at the links
        at the top to learn more!
      </p>
      {isMobile && (
        <p style={{ color: 'red' }}>
            Warning: Camera locking does not work on mobile devices due to issues
            with plotlyjs&apos; drag detection. We recommend keeping it unlocked.
        </p>
      )}
    </div>
  )
}
