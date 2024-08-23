import React from 'react';
import './Visualizer.css';

export default class Visualizer extends React.Component {
  state = { array: [] };

  componentDidMount() {
    this.resetArray();
  }

  resetArray = () => {
    const array = Array.from({ length: 100 }, () => this.getRandomInt(5, 1000));
    this.setState({ array });
  };

  bubbleSort = async () => {
    const array = this.state.array.slice(); 

    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];

          this.setState({ array });
          await this.sleep(50); 
        }
      }
    }
  };

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  bubbleSort = async () => {
    const array = this.state.array.slice(); 

    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];

          this.setState({ array });
          await this.sleep(50); 
        }
      }
    }
  };

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }




  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  render() {
    const { array } = this.state;

    return (
      <div>
        {array.map((value, idx) => (
          <div className="array-bar" key={idx} style={{ height: `${value}px` }}>
            {value}
          </div>
        ))}
        <button onClick={this.bubbleSort}>Start Bubble Sort</button>
      </div>
    );
  }
}
