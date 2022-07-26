module.exports.getDate = getDate;

function getDate() {

    let today = new Date();
    
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    
    return today.toLocaleDateString("en-US",options);

    //getDay method look into how getDay work
    // if(today.getDay() === 6 || today.getDay() === 0) {
    //     day = "weekend"
    // } else if(today.getDay() === 1) {
    //     day = "Monday"
    // } else {
    //     day = "weekday"
    // }

    // return day;
}

module.exports.getDay = getDay;

function getDay(){
    let today = new Date();
    
    const options = {
        weekday: "long"
    }
    
    return today.toLocaleDateString("en-US",options);
}