import React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import "./App.css";

class Visualizer extends React.Component {
  state = { 
    array: [], 
    speed: 10,
    arraySize: 50,
    isStopped: false,
    isPaused: false,
    currentBar: null,
    replacingBar: null,
    currentSort: null,
    sortDescription: '',
  };
  
  sortDescriptions = {
    bubbleSort: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. \n\nTime Complexity: O(n²) \nSpace Complexity: O(1)',
    insertionSort: 'Insertion Sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms. \n\nTime Complexity: O(n²) \nSpace Complexity: O(1)',
    quickSort: 'Quick Sort is an efficient sorting algorithm using a divide-and-conquer approach to partition the array. \n\nAverage Time Complexity: O(n log n) \nWorst-case Time Complexity: O(n²) \nSpace Complexity: O(log n)',
    selectionSort: 'Selection Sort divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly selects the smallest (or largest) element from the unsorted sublist and moves it to the sorted sublist. \n\nTime Complexity: O(n²) \nSpace Complexity: O(1)',
  };

  componentDidMount() {
    this.resetArray();  
  }

  resetArray = () => {
    const { arraySize } = this.state;
    const array = Array.from({ length: arraySize }, () => this.getRandomInt(100, 500));
    this.setState({ 
      array, 
      isStopped: true, 
      isPaused: true, 
      currentBar: null, 
      replacingBar: null,
      currentSort: null,
      sortDescription: '',
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

  handleArraySizeChange = (event, newValue) => {
    this.setState({ arraySize: newValue }, this.resetArray);
  };

  sleep(ms) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const sleepCheck = () => {
        if (this.state.isPaused) {
          setTimeout(sleepCheck, 50);
        } else if (Date.now() - startTime >= ms) {
          resolve();
        } else {
          setTimeout(sleepCheck, 10);
        }
      };
      sleepCheck();
    });
  }

  stopSorting = () => {
    this.setState({ isStopped: true, isPaused: false, currentSort: null, sortDescription: '' });
  };

  togglePause = () => {
    this.setState((prevState) => ({ isPaused: !prevState.isPaused }));
  };

  startSort = (sortMethodName) => {
    if (this.state.currentSort) {
      this.stopSorting();
    }
    const sortMethod = this[sortMethodName];
    const description = this.sortDescriptions[sortMethodName];
    this.setState({ 
      isStopped: false, 
      isPaused: false, 
      currentSort: sortMethodName, 
      sortDescription: description 
    }, () => {
      sortMethod();
    });
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
    } else {
      this.setState({ currentBar: null, replacingBar: null, currentSort: null });
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
    this.setState({ array });
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
    const { array, speed, isPaused, currentBar, replacingBar, currentSort, sortDescription, arraySize } = this.state;

    return (
      <div className="visualizer" style={{ '--array-size': arraySize }}>
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
          <button onClick={() => this.startSort('bubbleSort')} disabled={currentSort && currentSort !== 'bubbleSort'}>
            Start Bubble Sort
          </button>
          <button onClick={() => this.startSort('insertionSort')} disabled={currentSort && currentSort !== 'insertionSort'}>
            Start Insertion Sort
          </button>
          <button onClick={() => this.startSort('quickSort')} disabled={currentSort && currentSort !== 'quickSort'}>
            Start Quick Sort
          </button>
          <button onClick={() => this.startSort('selectionSort')} disabled={currentSort && currentSort !== 'selectionSort'}>
            Start Selection Sort
          </button>
          <button onClick={this.resetArray}>Reset Array</button>
          <button onClick={this.togglePause}>{isPaused ? "Resume Sorting" : "Pause Sorting"}</button>
        </div>

        {sortDescription && (
          <div className="description">
            <p>{sortDescription}</p>
          </div>
        )}

        <div className="slider-container">
          <Typography variant="h6" gutterBottom>
            Adjust Sorting Speed:
          </Typography>
          <Slider
            value={speed}
            onChange={this.handleSliderChange}
            min={1} 
            max={750} 
            step={5} 
            aria-labelledby="speed-slider"
          />
        </div>

        <div className="slider-container">
          <Typography variant="h6" gutterBottom>
            Adjust Array Size:
          </Typography>
          <Slider
            value={arraySize}
            onChange={this.handleArraySizeChange}
            min={10} 
            max={100} 
            step={5} 
            aria-labelledby="array-size-slider"
          />
        </div>
      </div>
    );
  }
}

export default Visualizer;
