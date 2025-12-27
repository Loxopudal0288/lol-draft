import React, { useState } from 'react'

function App() {
  const championCells = Array.from({ length: 172 }, (_, i) => i + 1)
  const [timer, setTimer] = useState(300)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [blueTeamName, setBlueTeamName] = useState('BLUE TEAM')
  const [redTeamName, setRedTeamName] = useState('RED TEAM')
  const [blueCaptainLink, setBlueCaptainLink] = useState('')
  const [redCaptainLink, setRedCaptainLink] = useState('')
  const [spectatorLink, setSpectatorLink] = useState('')
  
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
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-400">
      {/* ВЕРХНЕЕ ПРОСТРАНСТВО С ЭЛЕМЕНТАМИ УПРАВЛЕНИЯ - 550px */}
      <div className="h-[550px] bg-gray-900 border-b border-gray-800">
        <div className="h-full p-6">
          {/* Заголовок и таймер */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-300">LoL DRAFT ASSISTANT</h1>
              <p className="text-gray-500 mt-1">Professional tournament draft interface</p>
            </div>
            
            {/* Таймер */}
            <div className="mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-300 font-mono">
                  {formatTime(timer)}
                </div>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`px-4 py-2 rounded-lg ${isTimerRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} transition`}
                  >
                    {isTimerRunning ? '⏸️ Пауза' : '▶️ Старт'}
                  </button>
                  <button 
                    onClick={() => setTimer(300)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                  >
                    🔄 Сброс (5:00)
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Кнопки выдачи ссылок - ТЕПЕРЬ СВЕРХУ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Ссылка для капитана синей команды */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h4 className="font-medium text-blue-300 mb-2">Капитан синей команды</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => generateLink('blue')}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <span>🔗</span>
                  Выдать ссылку
                </button>
                {blueCaptainLink && (
                  <div className="text-xs text-gray-500 mt-2">
                    Ссылка активна
                  </div>
                )}
              </div>
            </div>
            
            {/* Ссылка для наблюдателей */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h4 className="font-medium text-gray-300 mb-2">Наблюдатели</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => generateLink('spectator')}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <span>👁️</span>
                  Выдать ссылку
                </button>
                {spectatorLink && (
                  <div className="text-xs text-gray-500 mt-2">
                    Ссылка активна
                  </div>
                )}
              </div>
            </div>
            
            {/* Ссылка для капитана красной команды */}
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
              <h4 className="font-medium text-red-300 mb-2">Капитан красной команды</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => generateLink('red')}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <span>🔗</span>
                  Выдать ссылку
                </button>
                {redCaptainLink && (
                  <div className="text-xs text-gray-500 mt-2">
                    Ссылка активна
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Названия команд - ТЕПЕРЬ СНИЗУ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Синяя команда */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h3 className="text-lg font-semibold text-blue-400">Синяя команда</h3>
              </div>
              <input
                type="text"
                value={blueTeamName}
                onChange={(e) => setBlueTeamName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-4 text-center text-2xl font-bold text-blue-400 placeholder-blue-900/50"
                placeholder="Введите название команды"
              />
              <div className="text-sm text-gray-500 mt-3">
                Капитан: ожидает подключения
              </div>
            </div>
            
            {/* Красная команда */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <h3 className="text-lg font-semibold text-red-400">Красная команда</h3>
              </div>
              <input
                type="text"
                value={redTeamName}
                onChange={(e) => setRedTeamName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-4 text-center text-2xl font-bold text-red-400 placeholder-red-900/50"
                placeholder="Введите название команды"
              />
              <div className="text-sm text-gray-500 mt-3">
                Капитан: ожидает подключения
              </div>
            </div>
          </div>
          
          {/* Статус */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">Готов к началу драфта</span>
            </div>
          </div>
        </div>
      </div>

      {/* СУЩЕСТВУЮЩИЙ ИНТЕРФЕЙС ДРАФТА */}
      <div className="h-screen bg-gray-950">
        <div className="h-full flex flex-col">
          {/* Минимальный хедер */}
          <div className="bg-gray-900 border-b border-gray-800 p-2 flex-shrink-0">
            <div className="max-w-[2000px] mx-auto">
              <h1 className="text-xl font-bold text-gray-300 text-center">
                LOL DRAFT
              </h1>
            </div>
          </div>

          {/* Основное содержимое */}
          <div className="flex-1 overflow-hidden bg-gray-950">
            <div className="max-w-[2000px] mx-auto h-full p-1">
              <div className="flex h-full">
                {/* Левая колонка: Синяя команда */}
                <div className="w-64 xl:w-72 flex-shrink-0">
                  <div className="bg-gray-900 border border-gray-800 rounded h-full flex flex-col">
                    <div className="p-2 border-b border-gray-800">
                      <div className="text-center text-sm text-gray-400">{blueTeamName}</div>
                    </div>
                    <div className="flex-1 p-2">
                      <div className="space-y-2">
                        {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((role) => (
                          <div key={role} className="bg-gray-900 border border-gray-800 rounded p-2">
                            <div className="h-24 bg-gray-950 rounded border-2 border-dashed border-gray-700 flex flex-col items-center justify-center">
                              <div className="text-gray-500 text-xs mb-1">{role}</div>
                              <div className="text-gray-600 text-sm">EMPTY</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Центральная часть: Квадратная выборка чемпионов */}
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="w-[600px] h-[600px] bg-gray-900 border border-gray-800 rounded-lg flex flex-col">
                    <div className="p-3 border-b border-gray-800 flex-shrink-0">
                      <div className="text-center">
                        <div className="text-sm text-gray-300 font-medium">CHAMPION SELECTION</div>
                        <div className="text-xs text-gray-500 mt-1">172 champions • 6 per row • Scroll inside</div>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3">
                      <div className="grid grid-cols-6 gap-1.5">
                        {championCells.map((num) => (
                          <div 
                            key={num}
                            className="aspect-square bg-gray-800 border border-gray-700 hover:bg-gray-700 transition flex items-center justify-center cursor-pointer"
                          >
                            <span className="text-gray-500 text-[9px]">{num}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="p-2 border-t border-gray-800 flex-shrink-0">
                      <div className="text-center text-xs text-gray-500">
                        Click to select • Drag to scroll
                      </div>
                    </div>
                  </div>
                </div>

                {/* Правая колонка: Красная команда */}
                <div className="w-64 xl:w-72 flex-shrink-0">
                  <div className="bg-gray-900 border border-gray-800 rounded h-full flex flex-col">
                    <div className="p-2 border-b border-gray-800">
                      <div className="text-center text-sm text-gray-400">{redTeamName}</div>
                    </div>
                    <div className="flex-1 p-2">
                      <div className="space-y-2">
                        {['TOP', 'JG', 'MID', 'ADC', 'SUP'].map((role) => (
                          <div key={role} className="bg-gray-900 border border-gray-800 rounded p-2">
                            <div className="h-24 bg-gray-950 rounded border-2 border-dashed border-gray-700 flex flex-col items-center justify-center">
                              <div className="text-gray-500 text-xs mb-1">{role}</div>
                              <div className="text-gray-600 text-sm">EMPTY</div>
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

          {/* Нижняя панель: Баны - БЕЗ ПРОБЕЛОВ МЕЖДУ ЯЧЕЙКАМИ */}
          <div className="bg-gray-900 border-t border-gray-800 p-3 pt-4 flex-shrink-0">
            <div className="max-w-[2000px] mx-auto">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Баны синей команды - все 5 ячеек рядом без пробелов */}
                <div className="flex-1">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                    <div className="text-center text-sm text-gray-400 mb-3">{blueTeamName} BANS</div>
                    <div className="flex justify-between">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div 
                          key={num}
                          className="w-28 h-32 bg-gray-950 rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center hover:border-gray-600 transition"
                        >
                          <div className="text-gray-500 text-4xl mb-2">×</div>
                          <span className="text-gray-400 text-lg">BAN {num}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Центральный статус */}
                <div className="lg:w-48 xl:w-56 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl text-gray-300 font-bold">DRAFT PHASE</div>
                    <div className="text-gray-400 text-sm mt-1">PICK / BAN ACTIVE</div>
                  </div>
                </div>

                {/* Баны красной команды - все 5 ячеек рядом без пробелов */}
                <div className="flex-1">
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                    <div className="text-center text-sm text-gray-400 mb-3">{redTeamName} BANS</div>
                    <div className="flex justify-between">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div 
                          key={num}
                          className="w-28 h-32 bg-gray-950 rounded-lg border-2 border-dashed border-gray-700 flex flex-col items-center justify-center hover:border-gray-600 transition"
                        >
                          <div className="text-gray-500 text-4xl mb-2">×</div>
                          <span className="text-gray-400 text-lg">BAN {num}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Футер (минимальный) */}
          <footer className="bg-gray-950 border-t border-gray-800 py-1 px-2 flex-shrink-0">
            <div className="max-w-[2000px] mx-auto">
              <div className="text-center text-xs text-gray-500">
                DRAFT CONTROL PANEL ACTIVE • READY FOR TOURNAMENT
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App