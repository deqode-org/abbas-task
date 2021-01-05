import React from 'react';
import './SearchBox.css';

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  onInputChange = (event) => {
    this.setState({ value: event.target.value });
  }

  render() {
    const { value } = this.state;
    return (
      <div className="searchBoxContainer">
        <input
          autoFocus
          type="text"
          placeholder="Search"
          className="form-control"
          value={value}
          onChange={this.onInputChange}
        />
      </div>
    );
  }
}

export default SearchBox;
