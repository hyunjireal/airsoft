import { useEffect, useState, type MouseEvent } from 'react'
import { Link, NavLink } from 'react-router-dom'
import darkModeIcon from '../../asset/icons/dark.svg'
import lightModeIcon from '../../asset/icons/light.svg'
import userAvatar from '../../asset/images/main_user01.png'

type CommunityTab = 'beginner' | 'free'
type ThemeMode = 'light' | 'dark'

type CommunityTopbarProps = {
  activeTab: CommunityTab
  onBeginnerClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  onFreeClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

const THEME_STORAGE_KEY = 'airsoft-theme'
const PROFILE_IMAGE_KEY = 'airsoft:home-profile-image'

const getInitialTheme = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  return localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark'
}

export function CommunityTopbar({
  activeTab,
  onBeginnerClick,
  onFreeClick,
}: CommunityTopbarProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme)
  const [profileImage, setProfileImage] = useState(() =>
    localStorage.getItem(PROFILE_IMAGE_KEY) || userAvatar,
  )

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
    localStorage.setItem(THEME_STORAGE_KEY, themeMode)
  }, [themeMode])

  useEffect(() => {
    const syncStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) {
        setThemeMode(event.newValue === 'light' ? 'light' : 'dark')
      } else if (event.key === PROFILE_IMAGE_KEY) {
        setProfileImage(event.newValue || userAvatar)
      }
    }

    const syncProfileOnFocus = () => {
      setProfileImage(localStorage.getItem(PROFILE_IMAGE_KEY) || userAvatar)
    }

    window.addEventListener('storage', syncStorage)
    window.addEventListener('focus', syncProfileOnFocus)

    return () => {
      window.removeEventListener('storage', syncStorage)
      window.removeEventListener('focus', syncProfileOnFocus)
    }
  }, [])

  const toggleThemeMode = () => {
    setThemeMode((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <header className="community_header">
      <div className="community_header_inner">
        <div className="community_header_actions" aria-label="테마와 프로필 바로가기">
          <button
            className="community_header_circle_button"
            type="button"
            aria-label={`${themeMode === 'dark' ? '라이트' : '다크'} 모드로 전환`}
            aria-pressed={themeMode === 'dark'}
            onClick={toggleThemeMode}
          >
            <img
              key={themeMode}
              className="community_header_theme_icon"
              src={themeMode === 'dark' ? lightModeIcon : darkModeIcon}
              alt=""
              aria-hidden="true"
            />
          </button>
          <Link className="community_header_profile_link" to="/my" aria-label="마이페이지로 이동">
            <img className="community_header_profile_image" src={profileImage} alt="" aria-hidden="true" />
          </Link>
        </div>

        <nav
          className={`community_tabs community_tabs--${activeTab}`}
          aria-label="커뮤니티 게시판"
        >
          <NavLink
            className={() => (activeTab === 'beginner' ? 'active' : '')}
            to="/community"
            end
            onClick={onBeginnerClick}
          >
            초보 질문방
          </NavLink>
          <NavLink
            className={() => (activeTab === 'free' ? 'active' : '')}
            to="/community/free"
            onClick={onFreeClick}
          >
            일반 게시판
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
