function insertionSort(arr, visualize){
    for(i = 1; i < arr.length; i++){
        let j = i - 1; 
        let value = arr[i]
        while(j >= 0 && arr[j] > value){
            arr[j+1] = arr[j];
            j = j - 1;
            if (visualize) {
                visualize([...arr]);
            }
        }
    arr[j + 1] = value
    if (visualize) {
        visualize([...arr]);
    }
    }
    return arr;

}
export default insertionSort