import React, { Component, PropTypes } from 'react';
import Select, { Creatable, Async, AsyncCreatable } from 'react-select';
import escapeStringRegExp from 'escape-string-regexp';


class TypedSelect extends Component {

  static propTypes = {
    async: PropTypes.bool,
    creatable: PropTypes.bool,
    loadOptions: PropTypes.func,
    minimumInput: PropTypes.number,
    extraOptions: PropTypes.array,
  };

  static defaultProps = {
    type: 'text',
    required: false,
    disabled: false,
    onChange: () => {},
    minimumInput: 0,
    extraOptions: [],
  };

  constructor(props, context) {
    super(props, context);
    this.completedTerms = {};
    props.extraOptions.forEach(opt => {
      this.completedTerms[opt.value] = opt;
    });
    this.getOptions = this.getOptions.bind(this);
  }

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
