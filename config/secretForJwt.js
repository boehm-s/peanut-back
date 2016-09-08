import uuid from 'uuid';
import {CronJob} from 'cron';


var secrett = uuid.v4();

let job = new CronJob('00 30 11 * * */2', () => {
  secrett = uuid.v4();
}, () => { console.log('secret updated'); }, true, 'America/Los_Angeles');

export var secret = secrett;
