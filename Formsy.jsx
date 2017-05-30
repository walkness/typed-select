import React, { Component, PropTypes } from 'react';
import { HOC } from 'formsy-react';
import { autobind } from 'core-decorators';

import InputWrapper from 'Components/Forms/InputWrapper';
import FormGroup from 'Components/Forms/FormGroup';

import BaseTypedSelect from './index';


class TypedSelect extends Component {

  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    formsy: PropTypes.shape({
      setValue: PropTypes.func,
    }),
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    prepValue: PropTypes.func,
    renderFeedback: PropTypes.func,
    required: PropTypes.bool,
    selectOptions: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    type: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    disabled: false,
    formsy: {},
    label: null,
    minimumInput: 0,
    onChange: () => {},
    placeholder: '',
    prepValue: v => v,
    renderFeedback: null,
    required: false,
    selectOptions: {},
    type: 'text',
  };

  @autobind
  changeValue(v) {
    const { formsy, onChange, prepValue } = this.props;
    const { setValue } = formsy;
    const value = prepValue(v);
    if (setValue) setValue(value || '');
    if (onChange) onChange(value);
  }

  render() {
    const { className, renderFeedback, selectOptions, onChange, ...inputOpts } = this.props;

    return (
      <div>

        <BaseTypedSelect
          {...inputOpts}
          {...selectOptions}
          onChange={this.changeValue}
        />

        { renderFeedback && renderFeedback() }

      </div>
    );
  }
}

export default HOC(InputWrapper(TypedSelect, FormGroup)); // eslint-disable-line new-cap
