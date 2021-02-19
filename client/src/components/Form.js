import React from 'react'
import { useForm, Controller } from 'react-hook-form'

const Form = ({ config, onSubmit, onChange, classes }) => {

  const formFields = Object.keys(config)

  const defaultValues = {}

  for (const field in config) {
    defaultValues[field] = config[field].value
  }

  const { register, handleSubmit, errors, control } = useForm({
    defaultValues
  })

  const formElements = formFields.map(field => {

    let fieldBody

    switch (config[field].element) {
      case 'input': {
        fieldBody = <Controller
          control={control}
          name={field}
          // rules={config[field].validation}
          render={() => (
            <input
              onChange={e => onChange(e)}
              value={config[field].value}
              type={config[field].type}
              name={field}
            />
          )}
        />
        break
      }
      case 'textarea': {
        fieldBody = <Controller
          control={control}
          name={field}
          // rules={config[field].validation}
          render={() => (
            <textarea
              name={field}
              onChange={e => onChange(e)}
              value={config[field].value}
            ></textarea>
          )}
        />
       
        break
      }
      case 'select' : {
        fieldBody = <Controller 
          control={control}
          name={field}  
          // rules={config[field].validation}    
          render={() => (
            <select
              name={field}
              onChange={e => onChange(e)}
              value={config[field].value}
            >{config[field].options.map(option => <option key={option.value}value={option.value}>{option.label}</option>)}
            </select>
          )}
        />
        break
      }
      default : {
        return null
      }
    }

    return <div key={field} className={'form-element-group'}>
      <label>{config[field].label}</label>
      {fieldBody}
      {/* {errors[field] && <p className={'form-element-error'}>Error</p>} */}
    </div>
  })

  return <form onSubmit={handleSubmit(onSubmit)} className={Array.isArray(classes) ? classes.join(' ') : null}>
    {formElements}
    <input 
      type={'submit'} 
      ref={register} 
      name={'submit'}
      className={'btn btn-primary'}/>
  </form>

}

export default Form