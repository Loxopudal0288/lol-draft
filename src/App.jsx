// Файл: C:\Users\zspir\lol-draft\src\App.js
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import RoleFilter from './components/RoleFilter'
import { filterChampionsByRole } from './data/championRoles'
import { fetchAllChampions, getFallbackChampions, addManualChampions } from './api/championApi'
import { getLocalizedRole } from './data/championTranslations'

function App() {
  const [blueTimer, setBlueTimer] = useState(35)
  const [redTimer, setRedTimer] = useState(35)
  const [draftTimer, setDraftTimer] = useState(35)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  
  const [blueTeamName, setBlueTeamName] = useState('')
  const [redTeamName, setRedTeamName] = useState('')
  const [blueTeamNameFinal, setBlueTeamNameFinal] = useState('BLUE TEAM')
  const [redTeamNameFinal, setRedTeamNameFinal] = useState('RED TEAM')
  const [isEditingBlue, setIsEditingBlue] = useState(true)
  const [isEditingRed, setIsEditingRed] = useState(true)
  
  const [selectedChampion, setSelectedChampion] = useState(null)
  
  const [blueCaptainLink, setBlueCaptainLink] = useState('')
  const [redCaptainLink, setRedCaptainLink] = useState('')
  const [spectatorLink, setSpectatorLink] = useState('')
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  
  const [champions, setChampions] = useState([])
  const [filteredChampions, setFilteredChampions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const championsContainerRef = useRef(null)
  
  useEffect(() => {
    let interval
    if (isTimerRunning && draftTimer > 0) {
      interval = setInterval(() => {
        setDraftTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            setIsTimerRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, draftTimer])
  
  const startDraftTimer = useCallback(() => {
    setDraftTimer(35)
    setIsTimerRunning(true)
  }, [])
  
  const stopDraftTimer = useCallback(() => {
    setIsTimerRunning(false)
  }, [])
  
  const resetDraftTimer = useCallback(() => {
    setDraftTimer(35)
    setIsTimerRunning(false)
  }, [])
  
  useEffect(() => {
    const loadChampions = async () => {
      try {
        let data = await fetchAllChampions()
        data = addManualChampions(data)
        setChampions(data)
        setFilteredChampions(data)
        setLoading(false)
      } catch (err) {
        console.error('Error loading champions:', err)
        setError('Не удалось загрузить чемпионов. Используется локальная база.')
        let fallbackData = getFallbackChampions()
        fallbackData = addManualChampions(fallbackData)
        setChampions(fallbackData)
        setFilteredChampions(fallbackData)
        setLoading(false)
      }
    }

    loadChampions()
  }, [])
  
  useEffect(() => {
    const savedBlueName = localStorage.getItem('lolDraftBlueTeamName')
    const savedRedName = localStorage.getItem('lolDraftRedTeamName')
    
    if (savedBlueName) {
      setBlueTeamNameFinal(savedBlueName)
      setIsEditingBlue(false)
    }
    
    if (savedRedName) {
      setRedTeamNameFinal(savedRedName)
      setIsEditingRed(false)
    }
  }, [])
  
  useEffect(() => {
    let filtered = champions
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(champ =>
        champ.russianName.toLowerCase().includes(query) ||
        champ.name.toLowerCase().includes(query) ||
        champ.title.toLowerCase().includes(query) ||
        (champ.tags && champ.tags.some(tag => tag.toLowerCase().includes(query)))
      )
    }
    
    filtered = filterChampionsByRole(filtered, selectedRole)
    setFilteredChampions(filtered)
  }, [searchQuery, selectedRole, champions])
  
  const resetRoleFilter = useCallback(() => {
    setSelectedRole(null)
  }, [])
  
  const selectChampion = useCallback((champion) => {
    setSelectedChampion(champion)
  }, [])
  
  const confirmSelection = useCallback(() => {
    if (selectedChampion) {
      alert(`Выбран чемпион: ${selectedChampion.russianName}`)
      setSelectedChampion(null)
    } else {
      alert('Сначала выберите чемпиона!')
    }
  }, [selectedChampion])
  
  const saveBlueTeamName = useCallback(() => {
    if (blueTeamName.trim()) {
      const finalName = blueTeamName.trim()
      setBlueTeamNameFinal(finalName)
      setIsEditingBlue(false)
      localStorage.setItem('lolDraftBlueTeamName', finalName)
    }
  }, [blueTeamName])
  
  const saveRedTeamName = useCallback(() => {
    if (redTeamName.trim()) {
      const finalName = redTeamName.trim()
      setRedTeamNameFinal(finalName)
      setIsEditingRed(false)
      localStorage.setItem('lolDraftRedTeamName', finalName)
    }
  }, [redTeamName])
  
  const startEditingBlue = useCallback(() => {
    setBlueTeamName(blueTeamNameFinal)
    setIsEditingBlue(true)
  }, [blueTeamNameFinal])
  
  const startEditingRed = useCallback(() => {
    setRedTeamName(redTeamNameFinal)
    setIsEditingRed(true)
  }, [redTeamNameFinal])
  
  const handleKeyPress = useCallback((e, team) => {
    if (e.key === 'Enter') {
      if (team === 'blue') {
        saveBlueTeamName()
      } else {
        saveRedTeamName()
      }
    }
  }, [saveBlueTeamName, saveRedTeamName])
  
  const generateLink = (type) => {
    const baseUrl = 'https://draft.lol/room/'
    const randomId = Math.random().toString(36).substring(2, 10)
    const link = `${baseUrl}${randomId}/${type}`
    
    if (type === 'blue') {
      setBlueCaptainLink(link)
    } else if (type === 'red') {
      setRedCaptainLink(link)
    } else {
      setSpectatorLink(link)
    }
    
    navigator.clipboard.writeText(link)
    alert(`Ссылка скопирована в буфер обмена: ${link}`)
  }
  
  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiMxRjJBM0UiLz4KPHBhdGggZD0iTTI0IDE2QzI3LjMxMzcgMTYgMzAgMTMuMzEzNyAzMCAxMEMzMC42LjY4NjI5IDI3LjMxMzcgNCAyNCA0QzIwLjY4NjMgNCAxOCA2LjY4NjI5IDE4IDEwQzE4IDEzLjMlN0NSMTIyMC42ODYzIDE2IDI0IDE2Wk0yNCAyMEMxOS41OCAyMCAxNiAyMS43OSAxNiAyNFYyOEgzMlYyNEMzMiAyMS43OSAyOC40MiAyMCAyNCAyMFoiIGZpbGw9IiM2NDc0OEIiLz4KPC9zdmc+Cg=='
  }
  
  // Рассчитываем количество строк для заполнения пространства
  const totalChampions = filteredChampions.length
  const championsPerRow = 10
  const rowsNeeded = Math.ceil(totalChampions / championsPerRow)
  const emptyCellsCount = rowsNeeded * championsPerRow - totalChampions
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-400 flex flex-col">
      {/* Верхняя панель настроек */}
      <div className="bg-gray-900 border-b border-gray-800 flex-shrink-0 overflow-auto">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-300">LoL DRAFT ASSISTANT</h1>
              <p className="text-gray-500 mt-1">Professional tournament draft interface</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-300 font-mono">
                  ТАЙМЕР ДРАФТА: {draftTimer} сек
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  Таймер для выбора чемпионов и банов
                </div>
                <div className="flex gap-2 mt-2 justify-center">
                  <button
                    onClick={startDraftTimer}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium"
                  >
                    Старт
                  </button>
                  <button
                    onClick={stopDraftTimer}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium"
                  >
                    Стоп
                  </button>
                  <button
                    onClick={resetDraftTimer}
                    className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium"
                  >
                    Сброс
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h4 className="font-medium text-blue-300 mb-2">Капитан синей команды</h4>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => generateLink('blue')}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <span>🔗</span>
                  Выдать ссылку
                </button>
                {blueCaptainLink && (
                  <div className="text-xs text-green-500 mt-2 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Ссылка активна
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h4 className="font-medium text-gray-300 mb-2">Наблюдатели</h4>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => generateLink('spectator')}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <span>👁️</span>
                  Выдать ссылку
                </button>
                {spectatorLink && (
                  <div className="text-xs text-green-500 mt-2 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Ссылка активна
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h4 className="font-medium text-red-300 mb-2">Капитан красной команды</h4>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => generateLink('red')}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <span>🔗</span>
                  Выдать ссылку
                </button>
                {redCaptainLink && (
                  <div className="text-xs text-green-500 mt-2 flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Ссылка активна
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <h3 className="text-lg font-semibold text-blue-400">Синяя команда</h3>
                </div>
              </div>
              
              {isEditingBlue ? (
                <div className="relative">
                  <input
                    type="text"
                    value={blueTeamName}
                    onChange={(e) => setBlueTeamName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'blue')}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-4 text-center text-2xl font-bold text-blue-400 placeholder-blue-900/50 mb-2"
                    placeholder="Введите название команды"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-center mt-2">
                    <button
                      onClick={saveBlueTeamName}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm transition"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => {
                        if (blueTeamNameFinal) {
                          setIsEditingBlue(false)
                        }
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium text-sm transition"
                    >
                      Отмена
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-1">
                    Нажмите Enter для сохранения
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-4 text-center mb-4">
                    <div className="text-2xl font-bold text-blue-400 break-words">
                      {blueTeamNameFinal}
                    </div>
                  </div>
                  <button
                    onClick={startEditingBlue}
                    className="absolute right-3 top-4 p-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Редактировать название"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-500">Капитан: </span>
                  <span className={blueCaptainLink ? 'text-green-400' : 'text-amber-400'}>
                    {blueCaptainLink ? 'подключен' : 'ожидает подключения'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <h3 className="text-lg font-semibold text-red-400">Красная команда</h3>
                </div>
              </div>
              
              {isEditingRed ? (
                <div className="relative">
                  <input
                    type="text"
                    value={redTeamName}
                    onChange={(e) => setRedTeamName(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, 'red')}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-4 text-center text-2xl font-bold text-red-400 placeholder-red-900/50 mb-2"
                    placeholder="Введите название команды"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-center mt-2">
                    <button
                      onClick={saveRedTeamName}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium text-sm transition"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => {
                        if (redTeamNameFinal) {
                          setIsEditingRed(false)
                        }
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium text-sm transition"
                    >
                      Отмена
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-1">
                    Нажмите Enter для сохранения
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <div className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-4 text-center mb-4">
                    <div className="text-2xl font-bold text-red-400 break-words">
                      {redTeamNameFinal}
                    </div>
                  </div>
                  <button
                    onClick={startEditingRed}
                    className="absolute right-3 top-4 p-1.5 bg-red-600 hover:bg-red-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Редактировать название"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                </div>
              )}
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-500">Капитан: </span>
                  <span className={redCaptainLink ? 'text-green-400' : 'text-amber-400'}>
                    {redCaptainLink ? 'подключен' : 'ожидает подключения'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной интерфейс драфта */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Шапка с названиями команд - всегда сверху */}
        <div className="bg-gray-900 border-b border-gray-800 py-3 px-4 flex-shrink-0">
          <div className="max-w-[2000px] mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-left">
                <div className="text-3xl font-bold tracking-wider" style={{
                  fontFamily: "'Rajdhani', 'Segoe UI', sans-serif",
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                }}>
                  {blueTeamNameFinal}
                </div>
              </div>
              
              <div className="flex-shrink-0 px-8">
                <h1 className="text-2xl font-bold text-gray-300 tracking-widest" style={{
                  fontFamily: "'Orbitron', 'Segoe UI', monospace",
                  fontWeight: 800,
                  letterSpacing: '0.1em'
                }}>
                  LOL DRAFT
                </h1>
              </div>
              
              <div className="flex-1 text-right">
                <div className="text-3xl font-bold tracking-wider" style={{
                  fontFamily: "'Rajdhani', 'Segoe UI', sans-serif",
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                }}>
                  {redTeamNameFinal}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Основной контент - растягивается по вертикали */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-[2000px] mx-auto min-h-full">
            <div className="flex min-h-full">
              {/* Левая колонка - Синяя команда (пики) */}
              <div className="w-48 xl:w-56 flex-shrink-0 border-r border-gray-800">
                <div className="bg-gray-900 min-h-full flex flex-col">
                  <div className="p-2 border-b border-gray-800">
                    <div className="text-center text-sm text-blue-400 truncate">{blueTeamNameFinal}</div>
                  </div>
                  <div className="flex-1 p-2">
                    <div className="space-y-2">
                      {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((role) => (
                        <div key={role} className="bg-gray-900 border border-gray-800 rounded p-1.5">
                          <div className="text-gray-500 text-xs mb-1 text-center">{role}</div>
                          <div className="h-16 rounded border border-dashed border-gray-700 bg-gray-950 flex flex-col items-center justify-center">
                            <div className="text-gray-600 text-xs">EMPTY</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Баны синей команды */}
                  <div className="p-2 border-t border-gray-800">
                    <div className="text-center text-xs text-blue-400 mb-2">{blueTeamNameFinal} BANS</div>
                    <div className="grid grid-cols-5 gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="relative">
                          <div className="h-12 rounded border border-dashed border-gray-600 bg-gray-900 flex flex-col items-center justify-center">
                            <div className="text-gray-500 text-sm">✗</div>
                            <span className="text-gray-400 text-[8px] mt-0.5">BAN {num}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Центральная часть - выбор чемпионов */}
              <div className="flex-1 flex flex-col">
                {/* Окно выбора чемпионов - фиксированная высота */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg m-2 flex flex-col">
                  <div className="p-3 border-b border-gray-800 flex-shrink-0">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <RoleFilter 
                          activeRole={selectedRole}
                          onRoleSelect={setSelectedRole}
                        />
                        
                        {selectedRole && (
                          <button
                            onClick={resetRoleFilter}
                            className="w-8 h-8 bg-gray-700 border border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-600 transition"
                            title="Сбросить фильтр по роли"
                          >
                            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-300 font-medium">ВЫБОР ЧЕМПИОНА</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {loading ? 'Загрузка...' : (
                            <>
                              {filteredChampions.length} чемпионов
                              {selectedRole && ` • Фильтр: ${selectedRole}`}
                              {searchQuery.trim() !== '' && ` • Поиск: "${searchQuery}"`}
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="w-64">
                        <div className="relative">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск чемпиона..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-300 text-sm placeholder-gray-500"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Контейнер для сетки чемпионов - БЕЗ СКРОЛЛА */}
                  <div 
                    ref={championsContainerRef}
                    className="p-2"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                          <p className="mt-4 text-gray-500">Загрузка чемпионов...</p>
                        </div>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                          <p className="text-red-400">{error}</p>
                          <p className="mt-2 text-gray-500 text-sm">Используется локальная база чемпионов</p>
                        </div>
                      </div>
                    ) : filteredChampions.length === 0 ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                          <p className="text-gray-500 text-lg">Чемпионы не найдены</p>
                          <p className="text-sm text-gray-600 mt-2">
                            Попробуйте изменить поисковый запрос или сбросить фильтр по роли
                          </p>
                          {selectedRole && (
                            <button
                              onClick={resetRoleFilter}
                              className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                            >
                              Сбросить фильтр по роли
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-10 gap-1">
                        {/* Отображаем всех чемпионов */}
                        {filteredChampions.map((champ) => (
                          <div 
                            key={champ.id}
                            onClick={() => selectChampion(champ)}
                            className={`cursor-pointer transition-all duration-150 ${
                              selectedChampion?.id === champ.id 
                                ? 'ring-2 ring-blue-500 ring-opacity-50' 
                                : 'hover:ring-1 hover:ring-gray-600'
                            }`}
                          >
                            <div className={`aspect-square rounded-lg flex flex-col items-center justify-center p-0.5 overflow-hidden ${
                              selectedChampion?.id === champ.id 
                                ? 'bg-blue-800 border-blue-600' 
                                : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                            }`}>
                              <img 
                                src={champ.icon} 
                                alt={champ.russianName}
                                className="w-full h-full object-cover rounded"
                                onError={handleImageError}
                                loading="lazy"
                              />
                            </div>
                            <div className="mt-0.5 text-center">
                              <div className={`text-[8px] truncate font-medium ${
                                selectedChampion?.id === champ.id 
                                  ? 'text-blue-300' 
                                  : 'text-gray-300'
                              }`}>
                                {champ.russianName}
                              </div>
                              <div className={`text-[6px] mt-0.5 ${
                                selectedChampion?.id === champ.id 
                                  ? 'text-blue-400' 
                                  : 'text-gray-500'
                              }`}>
                                {(champ.tags || []).map(tag => getLocalizedRole(tag)).join(', ') || 'Неизвестно'}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Заполняем пустые ячейки для сохранения структуры */}
                        {Array.from({ length: emptyCellsCount }).map((_, index) => (
                          <div 
                            key={`empty-${index}`}
                            className="opacity-0"
                            aria-hidden="true"
                          >
                            <div className="aspect-square rounded-lg bg-transparent"></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Статистика под сеткой */}
                  <div className="p-2 border-t border-gray-800 flex-shrink-0">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {selectedRole ? `Фильтр: ${selectedRole.toUpperCase()}` : 'Все роли'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Нажмите на чемпиона чтобы выбрать
                      </div>
                      <div className="text-xs text-gray-500">
                        {filteredChampions.length} из {champions.length} чемпионов
                      </div>
                    </div>
                  </div>
                </div>

                {/* Кнопка подтверждения */}
                <div className="px-2 pb-2">
                  <button
                    onClick={confirmSelection}
                    disabled={!selectedChampion}
                    className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
                      selectedChampion 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                        : 'bg-gray-800 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    ПОДТВЕРДИТЬ ВЫБОР
                  </button>
                </div>

                {/* Центральный таймер */}
                <div className="px-2 pb-2">
                  <div className="flex justify-center">
                    <div className="lg:w-40 flex flex-col items-center justify-center">
                      <div className="text-center">
                        <div className="text-sm text-gray-300 font-bold">ТАЙМЕР</div>
                        <div className={`text-3xl font-bold font-mono mt-1 ${isTimerRunning ? 'text-green-400 animate-pulse' : 'text-gray-400'}`}>
                          {draftTimer}
                          <span className="text-sm text-gray-500 ml-1">сек</span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={startDraftTimer}
                            className={`px-2 py-1 rounded text-xs font-medium ${isTimerRunning ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                            disabled={isTimerRunning}
                          >
                            Старт
                          </button>
                          <button
                            onClick={stopDraftTimer}
                            className={`px-2 py-1 rounded text-xs font-medium ${!isTimerRunning ? 'bg-gray-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                            disabled={!isTimerRunning}
                          >
                            Стоп
                          </button>
                          <button
                            onClick={resetDraftTimer}
                            className="px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs font-medium"
                          >
                            Сброс
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Дополнительное пространство снизу */}
                <div className="mt-8 mb-12 px-2">
                  <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Драфт панель управления</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Используйте фильтры и поиск для быстрого выбора чемпионов
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <div className="text-blue-400 text-sm font-medium">Синяя команда</div>
                        <div className="text-gray-400 text-xs mt-1">{blueTeamNameFinal}</div>
                      </div>
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <div className="text-gray-300 text-sm font-medium">Таймер</div>
                        <div className="text-gray-400 text-xs mt-1">{draftTimer} секунд</div>
                      </div>
                      <div className="bg-gray-800/50 p-3 rounded-lg">
                        <div className="text-red-400 text-sm font-medium">Красная команда</div>
                        <div className="text-gray-400 text-xs mt-1">{redTeamNameFinal}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Правая колонка - Красная команда (пики) */}
              <div className="w-48 xl:w-56 flex-shrink-0 border-l border-gray-800">
                <div className="bg-gray-900 min-h-full flex flex-col">
                  <div className="p-2 border-b border-gray-800">
                    <div className="text-center text-sm text-red-400 truncate">{redTeamNameFinal}</div>
                  </div>
                  <div className="flex-1 p-2">
                    <div className="space-y-2">
                      {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((role) => (
                        <div key={role} className="bg-gray-900 border border-gray-800 rounded p-1.5">
                          <div className="text-gray-500 text-xs mb-1 text-center">{role}</div>
                          <div className="h-16 rounded border border-dashed border-gray-700 bg-gray-950 flex flex-col items-center justify-center">
                            <div className="text-gray-600 text-xs">EMPTY</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Баны красной команды */}
                  <div className="p-2 border-t border-gray-800">
                    <div className="text-center text-xs text-red-400 mb-2">{redTeamNameFinal} BANS</div>
                    <div className="grid grid-cols-5 gap-1">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="relative">
                          <div className="h-12 rounded border border-dashed border-gray-600 bg-gray-900 flex flex-col items-center justify-center">
                            <div className="text-gray-500 text-sm">✗</div>
                            <span className="text-gray-400 text-[8px] mt-0.5">BAN {num}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Футер */}
        <footer className="bg-gray-950 border-t border-gray-800 py-3 px-4 flex-shrink-0 mt-auto">
          <div className="max-w-[2000px] mx-auto">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                DRAFT CONTROL PANEL v1.0
              </div>
              <div className="text-xs text-gray-500 text-center">
                ТАЙМЕР ДРАФТА: {draftTimer} сек • ЧЕМПИОНОВ: {champions.length}
                {selectedRole && ` • ФИЛЬТР: ${selectedRole.toUpperCase()}`}
              </div>
              <div className="text-xs text-gray-500">
                LoL Draft Assistant © 2024
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App