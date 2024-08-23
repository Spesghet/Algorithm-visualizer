import insertionSort from './src/algorithms/insertionSort.js';

function visualizeArray(arr) {
    const container = document.getElementById('array-container');
    container.innerHTML = '';  

    arr.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${value * 20}px`;  
        bar.style.width = `${100 / arr.length}%`;  
        container.appendChild(bar);
    });
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSort() {
    const array = [5, 3, 8, 4, 2, 7, 1, 6];
    await insertionSort(array, async (arr) => {
        visualizeArray(arr);
        await sleep(200);
    });
}
