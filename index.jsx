import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import InputWrapper from 'AppComponents/Forms/InputWrapper';
import FormGroup from 'AppComponents/Forms/FormGroup';

import BaseTypedSelect from './BaseInput';


class TypedSelect extends Component {

  static propTypes = {
    async: PropTypes.bool,
    className: PropTypes.string,
    creatable: PropTypes.bool,
    disabled: PropTypes.bool,
    formsy: PropTypes.shape({
      setValue: PropTypes.func,
    }),
    label: PropTypes.string,
    loadOptions: PropTypes.func,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    prepValue: PropTypes.func,
    renderFeedback: PropTypes.func,
    required: PropTypes.bool,
    selectOptions: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    showRequired: PropTypes.bool,
    type: PropTypes.string,
  };

  static defaultProps = {
    async: false,
    className: null,
    creatable: false,
    disabled: false,
    formsy: {},
    label: null,
    loadOptions: () => {},
    minimumInput: 0,
    onChange: () => {},
    placeholder: null,
    prepValue: v => v,
    renderFeedback: null,
    required: false,
    selectOptions: {},
    showRequired: false,
    type: 'text',
  };

  @autobind
  changeValue(v) {
    const { formsy, onChange } = this.props;
    const { setValue } = formsy;
    if (setValue || onChange) {
      const value = this.props.prepValue(v);
      if (setValue) setValue(value || '');
      if (onChange) onChange(value);
    }
  }

  render() {
    const { renderFeedback, selectOptions, placeholder, ...inputOpts } = this.props;
    const extraProps = {};
    if (placeholder) extraProps.placeholder = placeholder;
    return (
      <div>

        <BaseTypedSelect
          {...inputOpts}
          {...selectOptions}
          {...extraProps}
          onChange={this.changeValue}
        />

        { renderFeedback && renderFeedback() }

      </div>
    );
  }
}

export default InputWrapper(TypedSelect, FormGroup);
