import appLogger from "electron-log"

export default function captureLogs() {
  const originalConsole = global.console

  global.console = {
    ...originalConsole,

    log: (...args) => {
      originalConsole.log(...args)
      appLogger.log(...args)
    },

    info: (...args) => {
      originalConsole.info(...args)
      appLogger.info(...args)
    },

    warn: (...args) => {
      originalConsole.warn(...args)
      appLogger.warn(...args)
    },

    debug: (...args) => {
      originalConsole.debug(...args)
      appLogger.debug(...args)
    },

    error: (...args) => {
      originalConsole.error(...args)
      appLogger.error(...args)
    }
  }

  return () => {
    return (global.console = originalConsole)
  }
}
