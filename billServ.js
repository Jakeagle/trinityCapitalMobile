console.log('forked', process.pid);

const { MongoClient, ObjectId } = require('mongodb');
const uri =
  'mongodb+srv://JakobFerguson:XbdHM2FJsjg4ajiO@trinitycapitalproduction.1yr5eaa.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function main(client) {
  try {
    await client.connect();
    console.log('Connected, 20');
  } catch (e) {
    console.error(e);
  }
}

main(client).catch(console.error);

const cron = require('node-cron');
const cronParser = require('cron-parser');

process.on('message', message => {
  const profile = message.profile;
  const type = message.type;
  const amount = message.amount;
  const interval = message.interval;
  const billName = message.Name;
  const cat = message.Category;

  const prfName = profile.memberName;

  const newTrans = {
    amount: amount,
    interval: interval,
    Name: billName,
    Category: cat,
  };

  billSetter(type, prfName, newTrans);
});

const billSetter = async function (type, name, newTrans) {
  if (type === 'bill') {
    await client
      .db('TrinityCapital')
      .collection('User Profiles')
      .updateOne(
        { 'checkingAccount.accountHolder': name },
        { $push: { 'checkingAccount.bills': newTrans } }
      );
  } else if (type === 'payment') {
    await client
      .db('TrinityCapital')
      .collection('User Profiles')
      .updateOne(
        { 'checkingAccount.accountHolder': name },
        { $push: { 'checkingAccount.payments': newTrans } }
      );
  }

  billManager(name);
  paymentManager(name);
};

const billManager = async function (name) {
  let interval;
  const newProfile = await client
    .db('TrinityCapital')
    .collection('User Profiles')
    .findOne({ 'checkingAccount.accountHolder': name });

  let bills = newProfile.checkingAccount.bills;

  for (let i = 0; i < bills.length; i++) {
    let time = bills[i].interval;

    const now = new Date();
    const currentDay = now.getDate();
    let delay;

    if (time === 'weekly') {
      // Calculate the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const dayOfWeek = now.getDay();
      delay = `0 0 * * ${dayOfWeek}`;
    } else if (time === 'bi-weekly') {
      delay = `0 0 * * 1,15`;
    } else if (time === 'monthly') {
      delay = `0 0 ${currentDay} * *`;
    } else if (time === 'yearly') {
      delay = `0 0 1 1 *`;
    }

    //Displays the bills using the amount, every interval set above

    const billSet = async () => {
      let newDate = new Date().toISOString();
      await client
        .db('TrinityCapital')
        .collection('User Profiles')
        .updateOne(
          { 'checkingAccount.accountHolder': name },
          {
            $push: { 'checkingAccount.transactions': bills[i] },
          }
        );

      await client
        .db('TrinityCapital')
        .collection('User Profiles')
        .updateOne(
          { 'checkingAccount.accountHolder': name },
          {
            $push: { 'checkingAccount.movementsDates': newDate },
          }
        );

      balanceCalc(name);
      const updatedProfile = await client
        .db('TrinityCapital')
        .collection('User Profiles')
        .findOne({ 'checkingAccount.accountHolder': name });

      const updatedChecking = updatedProfile.checkingAccount;

      io.emit('checkingAccountUpdate', updatedChecking);
    };
    cron.schedule(delay, billSet);
    console.log(delay, 339);
  }
};

const paymentManager = async function (name) {
  let interval;
  const newProfile = await client
    .db('TrinityCapital')
    .collection('User Profiles')
    .findOne({ 'checkingAccount.accountHolder': name });

  let payments = newProfile.checkingAccount.payments;

  for (let i = 0; i < payments.length; i++) {
    let time = payments[i].interval;

    const now = new Date();
    const currentDay = now.getDate();
    let delay;

    if (time === 'weekly') {
      // Calculate the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      const dayOfWeek = now.getDay();
      delay = `0 0 * * ${dayOfWeek}`;
    } else if (time === 'bi-weekly') {
      delay = `0 0 * * 1,15`;
    } else if (time === 'monthly') {
      delay = `0 0 ${currentDay} * *`;
    } else if (time === 'yearly') {
      delay = `0 0 1 1 *`;
    }

    //Displays the bills using the amount, every interval set above

    const paymentSet = async () => {
      let newDate = new Date().toISOString();
      await client
        .db('TrinityCapital')
        .collection('User Profiles')
        .updateOne(
          { 'checkingAccount.accountHolder': name },
          {
            $push: { 'checkingAccount.transactions': payments[i] },
          }
        );

      await client
        .db('TrinityCapital')
        .collection('User Profiles')
        .updateOne(
          { 'checkingAccount.accountHolder': name },
          {
            $push: { 'checkingAccount.movementsDates': newDate },
          }
        );

      balanceCalc(name);
    };
    cron.schedule(delay, paymentSet);
    console.log(delay, 339);
  }
};

const balanceCalc = async function (name) {
  let balanceArray = [];
  let balance;
  let profile = await client
    .db('TrinityCapital')
    .collection('User Profiles')
    .findOne({ 'checkingAccount.accountHolder': name });

  if (profile.checkingAccount.transactions.length <= 0) {
    balance = 0;
  } else if (profile.checkingAccount.transactions.length > 0) {
    for (let i = 0; i < profile.checkingAccount.transactions.length; i++) {
      let transAmounts = profile.checkingAccount.transactions[i].amount;

      balanceArray.push(transAmounts);
      balance = balanceArray.reduce((acc, mov) => acc + mov, 0);
    }
  }
  await client
    .db('TrinityCapital')
    .collection('User Profiles')
    .updateOne(
      { 'checkingAccount.accountHolder': name },
      {
        $set: { 'checkingAccount.balanceTotal': balance },
      }
    );
};
