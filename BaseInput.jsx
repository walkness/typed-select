import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select, { Creatable, Async, AsyncCreatable } from 'react-select';
import escapeStringRegExp from 'escape-string-regexp';
import { autobind } from 'core-decorators';


class TypedSelect extends Component {

  static propTypes = {
    async: PropTypes.bool,
    creatable: PropTypes.bool,
    extraOptions: PropTypes.arrayOf(PropTypes.object),
    loadOptions: PropTypes.func,
    minimumInput: PropTypes.number,
  };

  static defaultProps = {
    async: false,
    creatable: false,
    disabled: false,
    extraOptions: [],
    loadOptions: () => {},
    minimumInput: 0,
    onChange: () => {},
    required: false,
    type: 'text',
  };

  constructor(props, context) {
    super(props, context);
    this.completedTerms = {};
    props.extraOptions.forEach((opt) => {
      this.completedTerms[opt.value] = opt;
    });
  }

  @autobind
  getOptions(input) {
    const { extraOptions } = this.props;
    if (input.length < this.props.minimumInput) {
      return Promise.resolve({ options: [...extraOptions] });
    }
    const completedTerms = Object.keys(this.completedTerms).filter(term => input.startsWith(term));
    if (completedTerms.length > 0) {
      const re = new RegExp(`(?:^|\\s)${escapeStringRegExp(input)}`, 'i');
      const options = this.completedTerms[completedTerms[0]].filter(term => term.label.match(re));
      return Promise.resolve({ options: [...options, ...extraOptions] });
    }
    return this.props.loadOptions(input).then(({ options, completed }) => {
      if (completed) {
        this.completedTerms[input.toLowerCase()] = options;
      }
      return { options: [...options, ...extraOptions] };
    });
  }

  render() {
    const { async, creatable, loadOptions, ...inputOpts } = this.props;
    if (async && creatable) {
      return <AsyncCreatable {...inputOpts} loadOptions={this.getOptions} />;
    } else if (async) {
      return <Async {...inputOpts} loadOptions={this.getOptions} />;
    } else if (creatable) {
      return <Creatable {...inputOpts} loadOptions={this.getOptions} />;
    }
    return <Select {...inputOpts} loadOptions={this.getOptions} />;
  }
}

export default TypedSelect;
