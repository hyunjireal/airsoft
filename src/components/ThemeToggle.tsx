import { useEffect, useState } from 'react'

type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'airsoft-theme'

function getInitialTheme(): ThemeMode {
  return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
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

      setThemeMode(event.newValue === 'dark' ? 'dark' : 'light')
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
    <button
      className={`global_theme_toggle is_${themeMode}`}
      type="button"
      aria-label={`${themeMode === 'dark' ? '라이트' : '다크'}모드로 전환`}
      aria-pressed={themeMode === 'dark'}
      onClick={toggleThemeMode}
    >
      <span className="global_theme_toggle_knob" aria-hidden="true" />
      <span className="global_theme_toggle_text">{themeMode === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}
