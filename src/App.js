import React, { useState } from 'react'
import SDK from '@waylay/rules-sdk'
import config from './sdk-config.json'

const client = new SDK({ clientID: 'foo', clientSecret: 'bar', domain: 'housekeeper-staging.waylay.io', config: config })
const builder = client.createTaskBuilder({ name: 'demo form rule' })
const allPlugins = builder.getPlugins()

const App = () => {
  const [ selectedPlug, setSelectedPlug ] = useState()
  const [ properties, setProperties ] = useState()
  const [ errorMessage, setErrorMessage ] = useState()

  const addStep = () => {
    const newStep = { name: selectedPlug.name, properties }

    try {
      builder.addStep(newStep)
      
      setSelectedPlug(null)
      setProperties(null)
      setErrorMessage(null)
    } catch (e) {
      setProperties(null)
      setErrorMessage(e.toString())
    }
  }
  
  return (
    <div className="App">
      <h1>Build rule</h1>
      {
        errorMessage && <div style={{ backgroundColor: 'red' }}>{ errorMessage }</div>
      }
      <div style={{ display: 'flex' }}>
        <div>
          <h3>Select plugin</h3>
          <select name="plugins" id="plugins" onChange={(e) => {  setSelectedPlug(JSON.parse(e.target.value)) }}>
            {
              allPlugins.map(plugin => (
                <option value={JSON.stringify(plugin)} key={plugin.name}>{plugin.name} - {plugin.description} {plugin.stream && ' - STREAM'}</option> 
              ))
            }
          </select>
        </div>
        {
          selectedPlug && (
            <div style={{ marginLeft: '50px' }}>
              <h3>Properties</h3>
              {
                selectedPlug.properties && (
                  Object.entries(selectedPlug.properties).map(([key, value]) => (
                    <div style={{ display: 'flex' }}>
                      <div style={{ marginRight: '10px' }}>{key}</div>
                      <input type='text' onChange={(e) => setProperties({ ...properties, [key]: e.target.value })} />
                    </div>
                  ))
                )
              }
            </div>
          )
        }
        {
          selectedPlug && (
            <div>
              <button type="button" onClick={() => addStep()}>Add Plugin</button>
            </div>
          ) 
        }
      </div>
      <h2>Configured Steps</h2>
      <div>
        {
          builder.getSteps().map(step => {
            return <div style={{ display: 'flex' }}>
              {step.name && <strong style={{ marginRight: '30px' }}>{step.name}</strong>}
              {
                step.properties && Object.entries(step.properties).map(([key, value]) => <div style={{ marginRight: '30px' }}>{key}: {value}</div>)
              }
            </div>
          })
        }
      </div>
    </div>
  )
}

export default App
