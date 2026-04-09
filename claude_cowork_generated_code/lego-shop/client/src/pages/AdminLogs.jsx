import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useLanguage } from '../context/LanguageContext'

export default function AdminLogs() {
  const [logs, setLogs] = useState([])
  const [activeTab, setActiveTab] = useState('technical')
  const [lineLimit, setLineLimit] = useState(500)
  const [loading, setLoading] = useState(true)
  const logViewerRef = useRef(null)

  const { t } = useLanguage()

  useEffect(() => {
    fetchLogs()
  }, [activeTab])

  useEffect(() => {
    if (logViewerRef.current) {
      logViewerRef.current.scrollTop = logViewerRef.current.scrollHeight
    }
  }, [logs])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const logType = activeTab === 'technical' ? 'technical' : 'business'
      const response = await axios.get(`/api/logs/${logType}?lines=${lineLimit}`)
      setLogs(response.data.logs || [])
    } catch (err) {
      console.error('Failed to fetch logs:', err)
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchLogs()
  }

  const handleOpenLogsDirectory = async () => {
    try {
      await axios.post('/api/logs/open-directory')
    } catch (err) {
      console.error('Failed to open logs directory:', err)
    }
  }

  const handleLineLimitChange = (e) => {
    const newLimit = parseInt(e.target.value)
    setLineLimit(newLimit)
  }

  const formatLogEntry = (entry) => {
    if (typeof entry === 'string') {
      return entry
    }
    if (entry.message) {
      return `[${entry.level || 'INFO'}] ${entry.message}`
    }
    return JSON.stringify(entry)
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>{t('admin.view_logs')}</h1>
      </div>

      <div className="logs-container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'technical' ? 'active' : ''}`}
            onClick={() => setActiveTab('technical')}
          >
            {t('admin.technical_logs')}
          </button>
          <button
            className={`tab ${activeTab === 'business' ? 'active' : ''}`}
            onClick={() => setActiveTab('business')}
          >
            {t('admin.business_logs')}
          </button>
        </div>

        <div className="log-controls">
          <div className="log-control-group">
            <label htmlFor="lineLimit">{t('admin.line_limit')}:</label>
            <input
              id="lineLimit"
              type="number"
              min="10"
              max="10000"
              step="100"
              value={lineLimit}
              onChange={handleLineLimitChange}
            />
          </div>
          <button className="btn btn-sm btn-primary" onClick={handleRefresh}>
            {t('admin.refresh')}
          </button>
          <button className="btn btn-sm btn-outline" onClick={handleOpenLogsDirectory}>
            {t('admin.open_logs_directory')}
          </button>
        </div>

        <div className="log-viewer" ref={logViewerRef}>
          {loading ? (
            <div className="log-line">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="log-line">No logs available</div>
          ) : (
            logs.map((log, idx) => {
              const isArray = Array.isArray(log)
              const logContent = isArray ? log.join(' | ') : formatLogEntry(log)
              const logLevel = (log.level || log[0] || 'INFO').toString().toUpperCase()

              return (
                <div
                  key={idx}
                  className={`log-line ${logLevel.toLowerCase()}`}
                >
                  {logContent}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
