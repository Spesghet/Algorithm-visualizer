import React from "react";
import "./App.css";

class Visualizer extends React.Component {
  state = {
    array: [],
    isstopped: false, 
  };

  pausebutton = () => {
    this.setState((prevState) => ({ isstopped: !prevState.isstopped }));
  };

  componentDidMount() {
    this.resetArray();
  }

  resetArray = () => {
    const array = Array.from({ length: 60 }, () => this.getRandomInt(1, 500));
    this.setState({ array, isstopped: false }); 
  };

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  render() {
    const { array, isstopped } = this.state;

    return (
      <div>
        {array.map((value, idx) => (
          <div className="array-bar" key={idx} style={{ height: `${value}px` }}></div>
        ))}
        <div>
          <button onClick={this.bubbleSort} disabled={isstopped}>
            Start Bubble Sort
          </button>
          <button onClick={this.insertionSort} disabled={isstopped}>
            Start Insertion Sort
          </button>
          <button onClick={() => this.quickSort()} disabled={isstopped}>
            Start Quick Sort
          </button>
          <button onClick={this.selectionSort} disabled={isstopped}>
            Start Selection Sort
          </button>
          <button onClick={this.resetArray} disabled={isstopped}>
            Reset Array
          </button>
          <button onClick={this.pausebutton}>{isstopped ? "Resume" : "Pause"}</button>
        </div>
      </div>
    );
  }

  bubbleSort = async () => {
    const array = this.state.array.slice();
    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (this.state.isstopped) return; 
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          this.setState({ array });
          await this.sleep(50);
        }
      }
    }
  };

  insertionSort = async () => {
    const array = this.state.array.slice();

    for (let i = 1; i < array.length; i++) {
      let j = i - 1;
      let value = array[i];

      while (j >= 0 && array[j] > value) {
        if (this.state.isstopped) return; 
        array[j + 1] = array[j];
        j--;

        this.setState({ array });
        await this.sleep(50);
      }

      array[j + 1] = value;
      this.setState({ array });
      await this.sleep(50);
    }
  };

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  quickSort = async (
    array = this.state.array.slice(),
    low = 0,
    high = array.length - 1
  ) => {
    if (this.state.isstopped) return; 
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
      if (this.state.isstopped) return; 
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        this.setState({ array });
        await this.sleep(50);
      }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    await this.sleep(50);
    return i + 1;
  };

  selectionSort = async () => {
    const array = this.state.array.slice();

    for (let i = 0; i < array.length - 1; i++) {
      if (this.state.isstopped) return; 
      let minIndex = i;
      for (let j = i + 1; j < array.length; j++) {
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        this.setState({ array });
        await this.sleep(50);
      }
    }
  };
}

export default Visualizer;
