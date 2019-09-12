process.env.NODE_ENV = 'test'
const expect = require("chai").expect;
const { addNotice, removeNotice, getUserNotices } = require('../../db/models/notices')
const { getUser, createNewUser, removeUserByUsername } = require('../../db/models/users')
const { getRandomDate, getEventLength} = require('../../db/mock/notices')
require('../_setup')

let username = "TestNoticeUser1";
let password = "Asdobo12ub"
let userId = 0;
before("Create user", () => {
    return createNewUser(username, password)
    .then(result => getUser(username))
    .then(result => userId = result.rows[0].id)
})
describe("#dbNoticesQuery", () => {
    context("Adding Valid Notice", () => {
        it("Attempts to create a new notice", () => {
            let beginDate = getRandomDate();
            let endDate = new Date(beginDate.getTime() + (getEventLength() * 60 * 60 * 1000));
            expect(beginDate).is.lessThan(endDate)
            
            return addNotice("Test Notice", beginDate, endDate, "ffffff", userId, "Test notice")
                .then(result => {
                    expect(result.rowCount).to.equal(1);
                })
        })
    })
    context("Removing User notice", () => {
        let noticeId = 0;
        before("Create Notice to remove", () => {
            let beginDate = getRandomDate();
            let endDate = new Date(beginDate.getTime() + (getEventLength() * 60 * 60 * 1000));
            return addNotice("Test Notice", beginDate, endDate, "ffffff", userId, "Test notice")
                .then(result => getUserNotices(userId))
                .then(result => {
                    if(result.rows[0]) noticeId = result.rows[0].id
                })
        })
        it("Removing an existing notice", () => {
            return removeNotice(noticeId)
                .then(result => expect(result.rowCount).to.equal(1))
        })
    })
    context("Selecting User notices", () => {
        it("Retrieving existing notices", () => {
            //Retrieve User Notices before and after adding one compare
            let beginDate = getRandomDate();
            let endDate = new Date(beginDate.getTime() + (getEventLength() * 60 * 60 * 1000));
            let numberOfNotices = 0;
            return getUserNotices(userId)
            .then(result => {
                numberOfNotices = result.rowCount;
                return addNotice("Test Notice", beginDate, endDate, "ffffff", userId, "Test notice")
            })
            .then(result => getUserNotices(userId))
            .then(result => expect(result.rowCount).to.equal(numberOfNotices + 1))           
        })
    })
})