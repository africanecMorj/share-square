module.exports = () => {
    let arr = [];
    while(arr.length<5){
        let n = Math.floor(Math.random()*6);
        if(!arr.includes(n)){
        arr.push(n);
        }
    }
    return arr.join(``);    
};

