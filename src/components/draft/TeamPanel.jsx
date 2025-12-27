import React from 'react'

export default function TeamPanel({ 
  team, 
  teamName, 
  teamColor, 
  onSelect, 
  onClear 
}) {
  const roles = ['Top', 'Jungle', 'Mid', 'Bot', 'Support']
  
  return (
    <div className={`${teamColor} p-6 rounded-2xl border-2 ${teamColor.includes('blue') ? 'border-blue-500' : 'border-red-500'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className={`w-4 h-4 rounded-full ${teamColor.includes('blue') ? 'bg-blue-500' : 'bg-red-500'}`}></span>
          {teamName} команда
        </h2>
        <div className="px-3 py-1 bg-white/10 rounded-full text-sm">
          {Object.values(team).filter(Boolean).length}/5
        </div>
      </div>
      
      <div className="space-y-3">
        {roles.map(role => (
          <div
            key={role}
            className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-800/70 transition"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${teamColor.includes('blue') ? 'bg-blue-900/50' : 'bg-red-900/50'}`}>
                <span className="font-bold text-lg">{role.charAt(0)}</span>
              </div>
              <div>
                <div className="font-medium">{role}</div>
                <div className="text-sm text-gray-400">
                  {team[role] ? team[role].name : 'Не выбран'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {team[role] ? (
                <>
                  <div className={`px-4 py-2 rounded-lg ${team[role].type === 'AD' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'} border ${team[role].type === 'AD' ? 'border-red-500/50' : 'border-blue-500/50'}`}>
                    <div className="flex items-center gap-2">
                      <span>{team[role].icon}</span>
                      <span className="font-bold">{team[role].name}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onClear(role)}
                    className="w-10 h-10 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
                  >
                    ×
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onSelect(role)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2"
                >
                  <span>Выбрать</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}