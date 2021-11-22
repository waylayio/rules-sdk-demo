import React, { useState } from 'react'
import Helper from '@waylay/rules-helper'
import ReactJson from 'react-json-view'

import config from './sdk-config.json'

const { subflow } = new Helper({ clientID: '', secret: '', domain: '', config: config })
const builder = subflow.createTaskBuilder()

const allPlugins = builder.getPlugins()

const App = () => {
  const [ selectedPlug, setSelectedPlug ] = useState(allPlugins[0])
  const [ properties, setProperties ] = useState()
  const [ errorMessage, setErrorMessage ] = useState()
  const [ name, setName ] = useState()
  const [ template, setTemplate ] = useState()

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

  const submit = async () => {
    if (!name) return setErrorMessage('template name missing')

    try {
      const { entity } = await builder.createTemplate(name)
      setTemplate(entity)
    } catch (e) {
      setErrorMessage(e.toString())
    }
  }

  const updateProperties = (key, value) => {
    const inputType = selectedPlug.properties[key].type
    
    let parsedValue

    switch (inputType) {
      case 'number': parsedValue = Number(value); break
      default: parsedValue = value
    }

    setProperties({ ...properties, [key]: parsedValue })
  }
  
  return (
    <div className="App">
      <h1>Build template</h1>
      {
        errorMessage && <div style={{ backgroundColor: 'red' }}>{ errorMessage }</div>
      }
      <div style={{ display: 'flex' }}>
        <div>
          <h3>Select subflow</h3>
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
              <div style={{ display: 'flex' }}>
                {
                  selectedPlug.properties && (
                    Object.entries(selectedPlug.properties).map(([key, value]) => (
                      <div style={{ display: 'flex' }}>
                        <div style={{ marginRight: '10px' }}>{key}</div>
                        <input type='text' onChange={(e) => updateProperties(key, e.target.value)} />
                      </div>
                    ))
                  )
                }
              </div>
            </div>
          )
        }
        {
          selectedPlug && (
            <div>
              <button type="button" onClick={() => addStep()}>Add Subflow</button>
            </div>
          ) 
        }
      </div>
      <h2>Configured Subflows</h2>
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
      <div>
        Name <input type='text' onChange={(e) => setName(e.target.value)} />
        <button type="button" onClick={() => submit()} style={{ marginTop: '10px' }}>Upload Template</button>
      </div>
      <div>
        {
          template && <ReactJson src={template} name={null} />
        }
      </div>
    </div>
  )
}

export default App
