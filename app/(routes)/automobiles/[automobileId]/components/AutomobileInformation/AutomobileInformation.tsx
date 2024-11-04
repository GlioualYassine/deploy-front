import React from 'react'
import { Voiture, VoitureInformationProps } from './AutomobileInformation.types'
import AutomobileForm from '../AutomobileForm/AutomobileForm'

const AutomobileInformation = (props : VoitureInformationProps) => {
    const { voiture } = props

  return (
    <div className='mt-5 grid grid-cols-1 '>
        <div className='rounded-lg bg-background shadow-md hover:shadow-lg p-4'>
            <AutomobileForm voiture={voiture}/>
        </div>

    </div>
  )
}

export default AutomobileInformation