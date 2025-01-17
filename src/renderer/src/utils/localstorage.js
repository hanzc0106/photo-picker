export function getConfigByKey(key) {
  const config = localStorage.getItem('config')
  if (!config) throw new Error('config not found in localStorage')

  return JSON.parse(config)[key]
}

export function setConfig(key, value) {
  const config = localStorage.getItem('config')

  if (!config) {
    localStorage.setItem('config', JSON.stringify({ [key]: value }))
  } else {
    const parsedConfig = JSON.parse(config)
    parsedConfig[key] = value
    localStorage.setItem('config', JSON.stringify(parsedConfig))
  }
}
