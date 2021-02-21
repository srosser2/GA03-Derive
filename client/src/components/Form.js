import React from 'react'
import { useForm, Controller } from 'react-hook-form'

import { Form } from 'react-bootstrap'
import Select from 'react-select'

const FormGenerator = ({ config, onSubmit, onChange, onSelectChange, classes }) => {

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
            <Form.Control
              onChange={e => onChange(e)}
              value={config[field].value}
              type={config[field].type}
              name={field}
              placeholder={config[field].placeholder}
            />
          )}
        />
        break
      }
      case 'textarea': {
        fieldBody = <Controller
          control={control}
          name={field}
          placeholder={config[field].type}
          // rules={config[field].validation}
          render={() => (
            <Form.Control as='textarea'
              name={field}
              onChange={e => onChange(e)}
              value={config[field].value}
            />
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

            <Select
              defaultValue={config[field].value}
              options={config[field].options}
              onChange={(e) => onSelectChange(e, field)}
              isMulti={config[field].isMulti}
            />
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

export default FormGenerator