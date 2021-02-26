import validator from 'validator'

const validateField = (value, rulesObj) => {
  let valid = true
  const validationErrorMessages = []
  for (const key in rulesObj) {
    switch (key) {
      case 'required': 
        if (rulesObj[key] === true) {
          valid = value.length > 0
          if (!valid) {
            validationErrorMessages.push('This field is required.')
          }
        }
        
        break
      case 'isEmail': 
        valid = validator.isEmail(value)
        if (!valid) {
          validationErrorMessages.push('Please provide a valid email.')
        }
        break
      case 'minLength':
        valid = validator.isLength(value, { min: rulesObj.minLength })
        if (!valid) {
          validationErrorMessages.push(`The minimum length for this field is ${rulesObj.minLength} characters.`)
        }
        break
      case 'maxLength': 
        valid = validator.isLength(value, { max: rulesObj.maxLength })
        validationErrorMessages.push(`The minimum length for this field is ${rulesObj.maxLength} characters.`)
        break
      default:
        valid = true
    }
  }
  return validationErrorMessages
  
}

export default validateField