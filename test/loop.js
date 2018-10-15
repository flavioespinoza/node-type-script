
const arr = []
let len = 1000
let count = 0
while (len--) {
  count++
  arr.push(count)
}

console.log(JSON.stringify(arr))