function bubblesort(arr, visualize){
    let n = arr.length;
    let sortedArray = [...arr];

    for (let i = 0; i < n - 1; i++){
        for(let j = 0; j < n-1-i; j++){
            if(sortedArray[j] > sortedArray[j+1]){
                [sortedArray[j],sortedArray[j+1]] = [sortedArray[j+1],sortedArray[j]]
                
                if (visualize){
                    visualize([...sortedArray])
                }
            }
        }
    }
    return sortedArray
}
export default bubblesort