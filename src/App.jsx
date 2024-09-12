import React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import "./App.css";

class Visualizer extends React.Component {
  state = { 
    array: [], 
    speed: 10,
    isStopped: false,
    isPaused: false,
    currentBar: null,
    replacingBar: null,
    currentSort: null,
  };
  
  componentDidMount() {
    this.resetArray();  
  }

  resetArray = () => {
    const array = Array.from({ length: 60 }, () => this.getRandomInt(100, 500));
    this.setState({ 
      array, 
      isStopped: true, 
      isPaused: true, 
      currentBar: null, 
      replacingBar: null,
      currentSort: null
    });
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
    return new Promise((resolve) => {
      const checkPause = () => {
        if (this.state.isPaused) {
          setTimeout(checkPause, 50);
        } else {
          resolve();
        }
      };
      setTimeout(checkPause, ms);
    });
  }

  stopSorting = () => {
    this.setState({ isStopped: true, isPaused: false, currentSort: null });
  };

  togglePause = () => {
    this.setState((prevState) => ({ isPaused: !prevState.isPaused }));
  };

  startSort = (sortMethod) => {
    if (this.state.currentSort) {
      this.stopSorting();
    }
    this.setState({ isStopped: false, isPaused: false, currentSort: sortMethod }, sortMethod);
  };

  bubbleSort = async () => {
    const array = this.state.array.slice();
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (this.state.isStopped) return;
        this.setState({ currentBar: j, replacingBar: j + 1 });
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          this.setState({ array });
          await this.sleep(800 - this.state.speed); 
        }
      }
      this.setState({ replacingBar: array.length - 1 - i }); 
    }
    this.setState({ currentBar: null, replacingBar: null, currentSort: null });
  };

  insertionSort = async () => {
    const array = this.state.array.slice();
    for (let i = 1; i < array.length; i++) {
      if (this.state.isStopped) return;
      let j = i - 1;
      let value = array[i];
      this.setState({ currentBar: i });
      while (j >= 0 && array[j] > value) {
        if (this.state.isStopped) return;
        array[j + 1] = array[j];
        j = j - 1;
        this.setState({ array, replacingBar: j + 1 });
        await this.sleep(800 - this.state.speed); 
      }
      array[j + 1] = value;
      this.setState({ array });
      await this.sleep(800 - this.state.speed);
    }
    this.setState({ currentBar: null, replacingBar: null, currentSort: null });
  };

  quickSort = async (array = this.state.array.slice(), low = 0, high = array.length - 1) => {
    if (this.state.isStopped) return;
    if (low < high) {
      const pi = await this.partition(array, low, high);
      await this.quickSort(array, low, pi - 1);
      await this.quickSort(array, pi + 1, high);
      this.setState({ array });
    }
  };

  partition = async (array, low, high) => {
    const pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (this.state.isStopped) return i + 1;
      this.setState({ currentBar: j, replacingBar: i });
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        this.setState({ array });
        await this.sleep(800 - this.state.speed); 
      }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    await this.sleep(800 - this.state.speed); 
    return i + 1;
  };

  selectionSort = async () => {
    const array = this.state.array.slice();
    for (let i = 0; i < array.length - 1; i++) {
      if (this.state.isStopped) return;
      let minIndex = i;
      for (let j = i + 1; j < array.length; j++) {
        if (this.state.isStopped) return;
        this.setState({ currentBar: j, replacingBar: minIndex });
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        this.setState({ array });
        await this.sleep(800 - this.state.speed); 
      }
    }
    this.setState({ currentBar: null, replacingBar: null, currentSort: null });
  };

  render() {
    const { array, speed, isPaused, currentBar, replacingBar, currentSort } = this.state;

    return (
      <div className="visualizer">
        <div className="array-container">
          {array.map((value, idx) => (
            <div 
              className={`array-bar ${idx === currentBar ? 'current-bar' : ''} ${idx === replacingBar ? 'replacing-bar' : ''}`} 
              key={idx} 
              style={{ height: `${value}px` }}>
            </div>
          ))}
        </div>

        <div>
          <button onClick={() => this.startSort(this.bubbleSort)} disabled={currentSort && currentSort !== this.bubbleSort}>
            Start Bubble Sort
          </button>
          <button onClick={() => this.startSort(this.insertionSort)} disabled={currentSort && currentSort !== this.insertionSort}>
            Start Insertion Sort
          </button>
          <button onClick={() => this.startSort(this.quickSort)} disabled={currentSort && currentSort !== this.quickSort}>
            Start Quick Sort
          </button>
          <button onClick={() => this.startSort(this.selectionSort)} disabled={currentSort && currentSort !== this.selectionSort}>
            Start Selection Sort
          </button>
          <button onClick={this.resetArray}>Reset Array</button>
          <button onClick={this.togglePause}>{isPaused ? "Resume Sorting" : "Pause Sorting"}</button>
        </div>

        <div className="slider-container">
          <Typography variant="h6" gutterBottom>
            Adjust Sorting Speed:
          </Typography>
          <Slider
            value={speed}
            onChange={this.handleSliderChange}
            min={1} 
            max={1000} 
            step={5} 
            aria-labelledby="speed-slider"
          />
        </div>
      </div>
    );
  }
}

export default Visualizer;
