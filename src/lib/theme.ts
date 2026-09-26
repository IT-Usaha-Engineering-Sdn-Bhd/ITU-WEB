export type ThemeMode = 'light' | 'dark'

// Runs in <head> before content paints. A strict CSP must authorize this script by nonce/hash.
export const themeInitializer = `(function(){var mode='light';try{var saved=localStorage.getItem('itu:theme');if(saved==='dark'||saved==='light')mode=saved}catch(e){}document.documentElement.dataset.mode=mode})()`

export function initializeTheme(
  root: Pick<HTMLElement, 'dataset'>,
  storage: () => Pick<Storage, 'getItem'>,
) {
  if (root.dataset.mode === 'light' || root.dataset.mode === 'dark') return
  let mode: ThemeMode = 'light'
  try {
    const saved = storage().getItem('itu:theme')
    if (saved === 'light' || saved === 'dark') mode = saved
  } catch {
    /* Optional storage. */
  }
  root.dataset.mode = mode
}

export function applyTheme(
  mode: ThemeMode,
  root: Pick<HTMLElement, 'dataset'>,
  storage: () => Pick<Storage, 'setItem'>,
) {
  root.dataset.mode = mode
  try {
    storage().setItem('itu:theme', mode)
  } catch {
    /* The visible choice works without persistence. */
  }
}
