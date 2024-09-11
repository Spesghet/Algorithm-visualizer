import React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import "./App.css";

class Visualizer extends React.Component {
  state = { 
    array: [], 
    speed: 50,
    isSorting: false
  };
  
  componentDidMount() {
    this.resetArray();  
  }

  resetArray = () => {
    const array = Array.from({ length: 60 }, () => this.getRandomInt(1, 500));
    this.setState({ array, isSorting: false });
  };

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  handleSliderChange = (event, newValue) => {
    this.setState({ speed: newValue });
  };

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  render() {
    const { array, speed, isSorting } = this.state;

    return (
      <div className="visualizer">
        <div className="array-container">
          {array.map((value, idx) => (
            <div className="array-bar" key={idx} style={{ height: `${value}px` }}></div>
          ))}
        </div>

        <div>
          <button onClick={this.bubbleSort} disabled={isSorting}>Start Bubble Sort</button>
          <button onClick={this.insertionSort} disabled={isSorting}>Start Insertion Sort</button>
          <button onClick={() => this.quickSort()} disabled={isSorting}>Start Quick Sort</button>
          <button onClick={this.bogosort} disabled={isSorting}>Start Bogo Sort</button>
          <button onClick={this.selectionSort} disabled={isSorting}>Start Selection Sort</button>
          <button onClick={this.resetArray}>Reset Array</button>
        </div>

        <div className="slider-container">
          <Typography variant="h6" gutterBottom>
            Adjust Sorting Speed:
          </Typography>
          <Slider
            value={speed}
            onChange={this.handleSliderChange}
            min={1} 
            max={100} 
            step={1} 
            aria-labelledby="speed-slider"
          />
          <Typography variant="body1" gutterBottom>
            Current Speed: {speed} ms delay
          </Typography>
        </div>
      </div>
    );
  }

  bubbleSort = async () => {
    this.setState({ isSorting: true });
    const array = this.state.array.slice();

    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          this.setState({ array });
          await this.sleep(100 - this.state.speed); 
        }
      }
    }
    this.setState({ isSorting: false });
  };

  insertionSort = async () => {
    this.setState({ isSorting: true });
    const array = this.state.array.slice();

    for (let i = 1; i < array.length; i++) {
      let j = i - 1;
      let value = array[i];

      while (j >= 0 && array[j] > value) {
        array[j + 1] = array[j];
        j = j - 1;

        this.setState({ array });
        await this.sleep(100 - this.state.speed); 
      }

      array[j + 1] = value;
      this.setState({ array });
      await this.sleep(100 - this.state.speed);
    }
    this.setState({ isSorting: false });
  };

  quickSort = async (
    array = this.state.array.slice(),
    low = 0,
    high = array.length - 1
  ) => {
    this.setState({ isSorting: true });
    if (low < high) {
      const pi = await this.partition(array, low, high);

      await this.quickSort(array, low, pi - 1);
      await this.quickSort(array, pi + 1, high);

      this.setState({ array });
    }
    this.setState({ isSorting: false });
  };

  partition = async (array, low, high) => {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        this.setState({ array });
        await this.sleep(100 - this.state.speed); 
      }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    await this.sleep(100 - this.state.speed); 
    return i + 1;
  };

  selectionSort = async () => {
    this.setState({ isSorting: true });
    const array = this.state.array.slice();

    for (let i = 0; i < array.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < array.length; j++) {
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        this.setState({ array });
        await this.sleep(100 - this.state.speed); 
      }
    }
    this.setState({ isSorting: false });
  };

  bogosort = async () => {
    this.setState({ isSorting: true });
    const array = this.state.array.slice(); 
  
    const isSorted = (arr) => {
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
          return false;
        }
      }
      return true;
    };
  
    while (!isSorted(array)) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
      }
  
      this.setState({ array });
      await this.sleep(100 - this.state.speed); 
    }
    this.setState({ isSorting: false });
  };
}

export default Visualizer;
