import React from 'react';

const FormRow = ({ type, name, value, handleChange, labelText }) => {
  return (
    <div className='form-row'>
      <label className='form-label' htmlFor={name}>
        {/* {labelText ? labelText : name} */}
        {labelText || name}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        className='form-input'
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default FormRow;
