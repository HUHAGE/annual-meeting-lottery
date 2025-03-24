const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

class Logger {
  constructor(level = 'INFO') {
    this.level = LOG_LEVELS[level]
  }

  debug(...args) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.debug('[DEBUG]', ...args)
    }
  }

  info(...args) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.info('[INFO]', ...args)
    }
  }

  warn(...args) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn('[WARN]', ...args)
    }
  }

  error(...args) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error('[ERROR]', ...args)
      // 可以在这里添加错误上报逻辑
    }
  }
}

export default new Logger(process.env.NODE_ENV === 'development' ? 'DEBUG' : 'INFO') 