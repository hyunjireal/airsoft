import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import darkModeIcon from '../asset/icons/main_dark.svg'
import lightModeIcon from '../asset/icons/main_light.svg'
import userAvatar from '../asset/images/main_user01.png'

type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'airsoft-theme'

function getInitialTheme(): ThemeMode {
  return localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark'
}

export function ThemeToggle() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
    localStorage.setItem(THEME_STORAGE_KEY, themeMode)
  }, [themeMode])

  useEffect(() => {
    const syncTheme = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return

      setThemeMode(event.newValue === 'light' ? 'light' : 'dark')
    }

    window.addEventListener('storage', syncTheme)

    return () => {
      window.removeEventListener('storage', syncTheme)
    }
  }, [])

  const toggleThemeMode = () => {
    setThemeMode((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className={`global_theme_toggle is_${themeMode}`} role="group" aria-label="테마와 프로필 바로가기">
      <button
        className="global_theme_toggle_button"
        type="button"
        aria-label={`${themeMode === 'dark' ? '라이트' : '다크'} 모드로 전환`}
        aria-pressed={themeMode === 'dark'}
        onClick={toggleThemeMode}
      >
        <img
          className="global_theme_toggle_icon"
          src={themeMode === 'dark' ? lightModeIcon : darkModeIcon}
          alt=""
        />
      </button>
      <span className="global_theme_toggle_divider" aria-hidden="true" />
      <Link className="global_theme_profile_link" to="/my" aria-label="마이페이지로 이동">
        <img className="global_theme_profile_image" src={userAvatar} alt="프로필" />
      </Link>
    </div>
  )
}
