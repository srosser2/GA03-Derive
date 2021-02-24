import React from 'react'

import { Form } from 'react-bootstrap'


const FileUpload = ({ handleUpload }) => {
  return <Form>
    <Form.File 
      onChange={e => handleUpload(e)}
      id="custom-file"
      label="Custom file input"
      custom
    />
  </Form>
}

export default FileUpload