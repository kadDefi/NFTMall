
export function parseNumber (number, decimal) {
    number = number + ''
    let a = number.indexOf('.') //小数点位置
    let f_count = 0 //小数位后位数
    if(a > 0){
        if(f_count > decimal){
            console.log('输入错误')
            return
        }
        f_count = number.slice(a+1).length
    }
    let b = decimal - f_count
    let c = ''
    for(let i = 0; i < b; i++){
        c += '0'
    }
    number = number.replace('.','')+c //替换小数点，进行补0
    while(true){ //删除掉数字前面的0
        if(number[0] == '0'){
            number = number.slice(1)
        }else{
            break
        }
    }
    return number;
}