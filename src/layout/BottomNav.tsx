import { useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import gaiImage from '../asset/images/gai.png'

const items = [
  { to: '/home', label: '홈' },
  { to: '/match', label: '매치' },
  { to: '/media', label: '미디어' },
  { to: '/community', label: '커뮤니티' },
]

export function BottomNav() {
  const location = useLocation()
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([])
  const timelineRefs = useRef<Array<gsap.core.Timeline | null>>([])
  const tweenRefs = useRef<Array<gsap.core.Tween | null>>([])
  const gaiRef = useRef<HTMLImageElement | null>(null)
  const gaiTweenRef = useRef<gsap.core.Tween | null>(null)
  const activeIndexRef = useRef(0)
  const pathname = location.pathname
  const activeIndex = Math.max(
    items.findIndex((item) => {
      if (pathname === '/my/schedule' && item.to === '/match') {
        return true
      }

      return pathname === item.to || pathname.startsWith(`${item.to}/`)
    }),
    0,
  )

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) {
          return
        }

        const pill = circle.parentElement
        const { width, height } = pill.getBoundingClientRect()
        const radius = ((width * width) / 4 + height * height) / (2 * height)
        const diameter = Math.ceil(2 * radius) + 2
        const delta =
          Math.ceil(radius - Math.sqrt(Math.max(0, radius * radius - (width * width) / 4))) + 1
        const originY = diameter - delta
        const label = pill.querySelector('.app_header_label')
        const hoverLabel = pill.querySelector('.app_header_label_hover')

        circle.style.width = `${diameter}px`
        circle.style.height = `${diameter}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        })
        gsap.set(label, { y: 0 })
        gsap.set(hoverLabel, { y: Math.ceil(height + 100), opacity: 0 })

        timelineRefs.current[index]?.kill()
        const timeline = gsap.timeline({ paused: true })
        timeline.to(circle, { scale: 1.18, xPercent: -50, duration: 2, ease: 'power3.out' }, 0)
        timeline.to(label, { y: -(height + 8), duration: 2, ease: 'power3.out' }, 0)
        timeline.to(hoverLabel, { y: 0, opacity: 1, duration: 2, ease: 'power3.out' }, 0)
        timelineRefs.current[index] = timeline
      })

      timelineRefs.current.forEach((timeline, index) => {
        if (!timeline) {
          return
        }

        timeline.progress(index === activeIndexRef.current ? 1 : 0)
      })
    }

    layout()
    window.addEventListener('resize', layout)
    document.fonts?.ready.then(layout).catch(() => undefined)

    return () => {
      window.removeEventListener('resize', layout)
      timelineRefs.current.forEach((timeline) => timeline?.kill())
      tweenRefs.current.forEach((tween) => tween?.kill())
      gaiTweenRef.current?.kill()
    }
  }, [])

  useEffect(() => {
    activeIndexRef.current = activeIndex

    timelineRefs.current.forEach((timeline, index) => {
      if (!timeline) {
        return
      }

      tweenRefs.current[index]?.kill()
      tweenRefs.current[index] = timeline.tweenTo(index === activeIndex ? timeline.duration() : 0, {
        duration: index === activeIndex ? 0.34 : 0.18,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    })
  }, [activeIndex])

  const handleEnter = (index: number) => {
    if (index === activeIndexRef.current) {
      return
    }

    const timeline = timelineRefs.current[index]
    if (!timeline) {
      return
    }

    tweenRefs.current[index]?.kill()
    tweenRefs.current[index] = timeline.tweenTo(timeline.duration(), {
      duration: 0.3,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const handleLeave = (index: number) => {
    if (index === activeIndexRef.current) {
      return
    }

    const timeline = timelineRefs.current[index]
    if (!timeline) {
      return
    }

    tweenRefs.current[index]?.kill()
    tweenRefs.current[index] = timeline.tweenTo(0, {
      duration: 0.2,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const handleGaiEnter = () => {
    const gai = gaiRef.current
    if (!gai) {
      return
    }

    gaiTweenRef.current?.kill()
    gsap.set(gai, { rotate: 0 })
    gaiTweenRef.current = gsap.to(gai, {
      rotate: 360,
      duration: 0.24,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  return (
    <header className="app_header">
      <nav className="app_header_left" aria-label="주요 내비게이션">
        {items.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={`app_header_menu${activeIndex === index ? ' is-active' : ''}`}
            onMouseEnter={() => handleEnter(index)}
            onMouseLeave={() => handleLeave(index)}
          >
            <span
              className="app_header_hover_circle"
              aria-hidden="true"
              ref={(element) => {
                circleRefs.current[index] = element
              }}
            />
            <span className="app_header_label_stack">
              <span className="app_header_label">{item.label}</span>
              <span className="app_header_label_hover" aria-hidden="true">
                {item.label}
              </span>
            </span>
          </NavLink>
        ))}
      </nav>

      <nav className="app_header_right" aria-label="AI 챗봇">
        <NavLink to="/chat" className="app_header_ai" aria-label="AI 챗봇" onMouseEnter={handleGaiEnter}>
          <img className="app_header_gai" src={gaiImage} alt="" aria-hidden="true" ref={gaiRef} />
        </NavLink>
      </nav>
    </header>
  )
}
