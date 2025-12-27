import React from 'react'
import { champions } from '../../data/champions'

export default function ChampionPicker({ 
  selectedRole, 
  onSelect, 
  onClose 
}) {
  const filteredChampions = champions.filter(champ => champ.role === selectedRole)
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">
            Выберите чемпиона для {selectedRole}
          </h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto flex-1 pr-2">
          {filteredChampions.map(champion => (
            <button
              key={champion.id}
              onClick={() => onSelect(champion)}
              className="p-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl flex flex-col items-center gap-2 transition hover:scale-[1.02]"
            >
              <div className="text-3xl">{champion.icon}</div>
              <div className="font-bold">{champion.name}</div>
              <div className={`text-xs px-2 py-1 rounded ${champion.type === 'AD' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
                {champion.type} • {champion.role}
              </div>
            </button>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl"
        >
          Отмена
        </button>
      </div>
    </div>
  )
}