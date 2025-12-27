import { useState } from 'react'

export function useDraft() {
  const [blueTeam, setBlueTeam] = useState({
    Top: null,
    Jungle: null,
    Mid: null,
    Bot: null,
    Support: null
  })
  
  const [redTeam, setRedTeam] = useState({
    Top: null,
    Jungle: null,
    Mid: null,
    Bot: null,
    Support: null
  })
  
  const [selectedRole, setSelectedRole] = useState('Top')
  const [selectedTeam, setSelectedTeam] = useState('blue')
  const [showPicker, setShowPicker] = useState(false)
  
  const selectChampion = (champion) => {
    if (selectedTeam === 'blue') {
      setBlueTeam({ ...blueTeam, [selectedRole]: champion })
    } else {
      setRedTeam({ ...redTeam, [selectedRole]: champion })
    }
    setShowPicker(false)
  }
  
  const clearRole = (team, role) => {
    if (team === 'blue') {
      setBlueTeam({ ...blueTeam, [role]: null })
    } else {
      setRedTeam({ ...redTeam, [role]: null })
    }
  }
  
  const resetDraft = () => {
    setBlueTeam({
      Top: null,
      Jungle: null,
      Mid: null,
      Bot: null,
      Support: null
    })
    setRedTeam({
      Top: null,
      Jungle: null,
      Mid: null,
      Bot: null,
      Support: null
    })
  }
  
  return {
    blueTeam,
    redTeam,
    selectedRole,
    selectedTeam,
    showPicker,
    setSelectedRole,
    setSelectedTeam,
    setShowPicker,
    selectChampion,
    clearRole,
    resetDraft
  }
}