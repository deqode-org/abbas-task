import React from 'react';
import getSuggestions from '../../api';
import { debounce } from '../../utils';
import './SearchBox.css';

const KEYBOARD_KEYS = {
  ENTER: 13,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
};

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      suggestions: [], // to store list of suggestions
      activeOption: 0, // to set css of selected option
      showOptions: false,
    };

    // ref object created to ring focus back on input field for continous typing
    this.searchInput = React.createRef();

    // Debouncing feature
    this.getSuggestionsFromServer = debounce(this.generateSuggestionList, 500);
  }

  // click function to control mouse based selections
  onOptionClick = (e) => {
    e.stopPropagation();
    this.changeValue(`${e.currentTarget.innerText} `);
    this.setState({ activeOption: 0, showOptions: false });
    this.searchInput.current.focus();
  };

  // keydown function to control arrow key based selections
  onKeyDown = (e) => {
    if(this.state.showOptions) {
      switch(e.keyCode) {
        case KEYBOARD_KEYS.ENTER: {
          this.setState({ activeOption: 0, showOptions: false });
          this.changeValue(this.state.suggestions[this.state.activeOption] + ' ');
          return;
        }
        case KEYBOARD_KEYS.UP_ARROW: {
          e.preventDefault();
          if (this.state.activeOption === 0) {
            return;
          }
          this.setState({ activeOption: this.state.activeOption - 1 });
          return;
        }
        case KEYBOARD_KEYS.DOWN_ARROW: {
          e.preventDefault();
          if (this.state.activeOption === this.state.suggestions.length - 1) {
            return;
          }
          this.setState({ activeOption: this.state.activeOption + 1 });
          return;
        }
        default:
          return;
      }
    }
  };

  // function to change last word of search text on suggestion selection
  changeValue = (text) => {
    const tokens = this.state.value.split(' ');
    tokens[tokens.length - 1] = text;
    this.setState({ value: tokens.join(' ') });
  };

  generateSuggestionList = (text) => {
    const tokens = text.split(' ');
    if (tokens[tokens.length - 1] !== '') {
      getSuggestions(tokens[tokens.length - 1])
        .then((e) => this.setState({ suggestions: e, showOptions: true }))
        .catch(console.error);
    }
  };

  onInputChange = (event) => {
    this.setState({ value: event.target.value, showOptions: false });
    this.getSuggestionsFromServer(event.target.value)
  }

  render() {
    const { value, showOptions, suggestions } = this.state;

    return (
      <div className="searchBoxContainer">
        <input
          autoFocus
          type="text"
          placeholder="Search"
          className="form-control"
          value={value}
          onKeyDown={this.onKeyDown}
          onChange={this.onInputChange}
          ref={this.searchInput}
        />
        <ul className="options">
          {showOptions && suggestions && suggestions.map((optionName, index) => (
            <li 
              key={optionName}
              className={index === this.state.activeOption ? 'optionActive listElement' : 'listElement'}
              onClick={this.onOptionClick}
            >
              {optionName}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default SearchBox;
