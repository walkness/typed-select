import React, { Component, PropTypes } from 'react';
import { HOC } from 'formsy-react';
import { default as BaseTypedSelect } from '../TypedSelect';

import InputWrapper from './InputWrapper';


class TypedSelect extends Component {

  static propTypes = {
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    wrapperClasses: PropTypes.string,
    className: PropTypes.string,
    replaceStatusClass: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    setValue: PropTypes.func.isRequired,
    getValue: PropTypes.func.isRequired,
    isPristine: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    getErrorMessage: PropTypes.func.isRequired,
    showRequired: PropTypes.func.isRequired,
    async: PropTypes.bool,
    creatable: PropTypes.bool,
    loadOptions: PropTypes.func,
    selectOptions: PropTypes.object,
    prepValue: PropTypes.func,
  };

  static defaultProps = {
    type: 'text',
    required: false,
    disabled: false,
    onChange: () => {},
    minimumInput: 0,
    prepValue: v => v,
  };

  constructor(props, context) {
    super(props, context);
    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(v) {
    const value = this.props.prepValue(v);
    this.props.setValue(value || '');
    this.props.onChange(value);
  }

  render() {
    const { className, wrapperClasses, ...wrapperProps } = this.props;
    const { type, name, required, disabled, label, selectOptions } = this.props;
    const id = `id_${name}`;
    const inputOpts = {
      id,
      type,
      name,
      required,
      disabled,
      value: this.props.getValue(),
      onChange: this.changeValue,
      className,
      ...selectOptions,
    };

    return (
      <InputWrapper
        {...wrapperProps}
        className={wrapperClasses}
        id={id}
        label={label}
      >

        <BaseTypedSelect {...inputOpts} />

        <div className='feedback help-block'>
          { this.props.getErrorMessage() }
          { this.props.showRequired() && !this.props.isPristine() ?
            'This field is required.' : null }
        </div>

      </InputWrapper>
    );
  }
}

export default HOC(TypedSelect); // eslint-disable-line new-cap
