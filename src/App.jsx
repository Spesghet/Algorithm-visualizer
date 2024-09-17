import React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import "./App.css";

class Visualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      array: [], 
      speed: 10,
      arraySize: 50,
      isStopped: false,
      isPaused: false,
      currentBar: null,
      comparingBar: null,
      currentSort: null,
      sortDescription: '',
    };
    this.currentSortingProcessId = 0; 
  }
  
  sortDescriptions = {
    bubbleSort: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.\n\nTime Complexity: O(n²)\nSpace Complexity: O(1)',
    insertionSort: 'Insertion Sort builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms.\n\nTime Complexity: O(n²)\nSpace Complexity: O(1)',
    quickSort: 'Quick Sort is an efficient sorting algorithm using a divide-and-conquer approach to partition the array.\n\nAverage Time Complexity: O(n log n)\nWorst-case Time Complexity: O(n²)\nSpace Complexity: O(log n)',
    selectionSort: 'Selection Sort divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly selects the smallest (or largest) element from the unsorted sublist and moves it to the sorted sublist.\n\nTime Complexity: O(n²)\nSpace Complexity: O(1)',
  };

  componentDidMount() {
    this.resetArray();  
  }

  resetArray = () => {
    const { arraySize } = this.state;
    const array = Array.from({ length: arraySize }, () => this.getRandomInt(100, 500));
    this.currentSortingProcessId = 0; 
    this.setState({ 
      array, 
      isStopped: true, 
      isPaused: true, 
      currentBar: null, 
      comparingBar: null,
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

  sleep(ms, sortingProcessId) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const sleepCheck = () => {
        if (this.state.isPaused) {
          setTimeout(sleepCheck, 50);
        } else if (this.state.isStopped || sortingProcessId !== this.currentSortingProcessId) {
          resolve();
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
    this.currentSortingProcessId++; 
    const sortingProcessId = this.currentSortingProcessId;
    const sortMethod = this[sortMethodName];
    const description = this.sortDescriptions[sortMethodName];
    this.setState({ 
      isStopped: false, 
      isPaused: false, 
      currentSort: sortMethodName, 
      sortDescription: description 
    }, () => {
      sortMethod(sortingProcessId);
    });
  };

  bubbleSort = async (sortingProcessId) => {
    const array = this.state.array.slice();
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (this.state.isStopped || sortingProcessId !== this.currentSortingProcessId) return;
        this.setState({ currentBar: j, comparingBar: j + 1 });
        await this.sleep(800 - this.state.speed, sortingProcessId);
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          this.setState({ array });
          await this.sleep(800 - this.state.speed, sortingProcessId);
        }
        this.setState({ currentBar: null, comparingBar: null });
      }
    }
    if (sortingProcessId === this.currentSortingProcessId) {
      this.setState({ currentBar: null, comparingBar: null, currentSort: null });
    }
  };

  insertionSort = async (sortingProcessId) => {
    const array = this.state.array.slice();
    for (let i = 1; i < array.length; i++) {
      if (this.state.isStopped || sortingProcessId !== this.currentSortingProcessId) return;
      let key = array[i];
      let j = i - 1;
      this.setState({ currentBar: i });
      await this.sleep(800 - this.state.speed, sortingProcessId);
      while (j >= 0 && array[j] > key) {
        if (this.state.isStopped || sortingProcessId !== this.currentSortingProcessId) return;
        this.setState({ comparingBar: j });
        await this.sleep(800 - this.state.speed, sortingProcessId);
        array[j + 1] = array[j];
        this.setState({ array });
        j = j - 1;
      }
      array[j + 1] = key;
      this.setState({ array });
      this.setState({ currentBar: null, comparingBar: null });
      await this.sleep(800 - this.state.speed, sortingProcessId);
    }
    if (sortingProcessId === this.currentSortingProcessId) {
      this.setState({ currentBar: null, comparingBar: null, currentSort: null });
    }
  };

  selectionSort = async (sortingProcessId) => {
    const array = this.state.array.slice();
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
      if (this.state.isStopped || sortingProcessId !== this.currentSortingProcessId) return;
      let minIndex = i;
      this.setState({ currentBar: i });
      for (let j = i + 1; j < n; j++) {
        if (this.state.isStopped || sortingProcessId !== this.currentSortingProcessId) return;
        this.setState({ comparingBar: j });
        await this.sleep(800 - this.state.speed, sortingProcessId);
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
        this.setState({ comparingBar: null });
      }
      if (minIndex !== i) {
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        this.setState({ array });
        await this.sleep(800 - this.state.speed, sortingProcessId);
      }
      this.setState({ currentBar: null });
    }
    if (sortingProcessId === this.currentSortingProcessId) {
      this.setState({ currentBar: null, comparingBar: null, currentSort: null });
    }
  };

  quickSort = async (sortingProcessId, array = this.state.array.slice(), low = 0, high = array.length - 1) => {
    if (this.state.isStopped || sortingProcessId !== this.currentSortingProcessId) return;
    if (low < high) {
      const pi = await this.partition(array, low, high, sortingProcessId);
      await this.quickSort(sortingProcessId, array, low, pi - 1);
      await this.quickSort(sortingProcessId, array, pi + 1, high);
      if (sortingProcessId !== this.currentSortingProcessId) return;
      this.setState({ array });
    } else {
      if (sortingProcessId === this.currentSortingProcessId) {
        this.setState({ currentBar: null, comparingBar: null, currentSort: null });
      }
    }
  };

  partition = async (array, low, high, sortingProcessId) => {
    const pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (this.state.isStopped || sortingProcessId !== this.currentSortingProcessId) return i + 1;
      this.setState({ currentBar: j, comparingBar: high });
      await this.sleep(800 - this.state.speed, sortingProcessId);
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        this.setState({ array });
        await this.sleep(800 - this.state.speed, sortingProcessId);
      }
      this.setState({ currentBar: null, comparingBar: null });
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    this.setState({ array });
    await this.sleep(800 - this.state.speed, sortingProcessId);
    return i + 1;
  };

  render() {
    const { array, speed, isPaused, currentBar, comparingBar, currentSort, sortDescription, arraySize } = this.state;

    return (
      <div className="visualizer" style={{ '--array-size': arraySize }}>
        <div className="array-container">
          {array.map((value, idx) => (
            <div 
              className={`array-bar 
                ${idx === currentBar ? 'current-bar' : ''} 
                ${idx === comparingBar ? 'comparing-bar' : ''}`} 
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
