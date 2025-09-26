import { useContext } from 'react'
import { AssistantsContext } from '@/contexts/assistants/AssistantsContext'

export const useAssistants = () => useContext(AssistantsContext)
