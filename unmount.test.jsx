import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import withSideEffect from 'react-side-effect';
import './setup';


class BuggyUnmount extends React.PureComponent {
  componentWillUnmount() {
    throw new Error('Please catch!');
  }

  render() {
    return <div></div>;
  }
}

class Div extends React.PureComponent {
  render() {
    return <div/>;
  }
}

const BuggySideEffect = withSideEffect(
  (propsList) => { return propsList[propsList.length - 1]; },
  // return-value may be undefined when .length === 0
  ({ violation }) => {}
  // "TypeError: Cannot destructure property `violation` of 'undefined' or 'null'."
)(Div);

describe('Impossible to catch errors on componentWillUnmount', () => {
  it('Error on componentWillUnmount', () => {
    const wrapper = mount(<BuggyUnmount/>);

    expect(() => wrapper.unmount()).toThrowError('Please catch!');
  });

  it('Error through side effect', () => {
    const wrapper = mount(
      <BuggySideEffect>
        <BuggySideEffect/>
      </BuggySideEffect>
    );

    expect(() => wrapper.unmount()).toThrow();
  });
});
