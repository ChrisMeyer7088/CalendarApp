const { addNotice } = require('../models/notices');
const { getUsers } = require('../models/users');

function addMockNotices() {
    for(let i = 0; i < 20; i++) {
        let beginDate = getRandomDate();
        let endDate = new Date(beginDate.getTime() + (getEventLength() * 60 * 60 * 1000))
        getUsers()
            .then(users => {
                console.log(users)
                let randomUser = getRandomInt(0, users.length);
                addNotice(`Notice Number ${i}`, beginDate, endDate, `ffffff`, users[randomUser].id, "This is mock data")
            })
            .then(result => {

            })
    }
}

function getRandomDate() {
    let month = getRandomInt(0, 12);
    let year = 2019;
    let day = getRandomInt(1,29)
    let hour = getRandomInt(1,25);
    let minute = getRandomInt(1,61);
    return new Date(Date.UTC(year, month, day, hour, minute))
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * Math.floor(max-min)) + min;
}

//Makes the majority of events to be less than 5 hours long
function getEventLength() {
    let probability = Math.floor(Math.random * Math.floor(10));
    if(probability < 7) return getRandomInt(1, 5);
    else return getRandomInt(1,25);
}

module.exports = {
    getRandomDate,
    getEventLength
}