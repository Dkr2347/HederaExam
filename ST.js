
const {
    Client,
    Hbar,
    TransferTransaction,
    ScheduleCreateTransaction
} = require("@hashgraph/sdk");
const operatorConfig = require('./operator.json');
//Step 1. create client
const accountId = operatorConfig.MY_ACCOUNT_ID;
const privateKey = operatorConfig.MY_PRIVATE_KEY;
const client = Client.forTestnet().setOperator(accountId, privateKey);
//Task 1
async function createSchedule() {
    //Create the transfer transaction
const sendHbarTxn = await new TransferTransaction()
.addHbarTransfer(accountId, new Hbar(-1)) //Sending account
.addHbarTransfer("0.0.465096", new Hbar(1)) //Receiving account
//Create a schedule transaction
const transaction = await new ScheduleCreateTransaction()
     .setScheduledTransaction(sendHbarTxn);
//Sign with the client operator key and submit the transaction to a Hedera network
const txResponse = await transaction.execute(client);
//Request the receipt of the transaction
const receipt = await txResponse.getReceipt(client);
const txnId = receipt.scheduledTransactionId;
console.log("The scheduled transaction ID of the schedule transaction is " +txnId);
}
createSchedule();
//module.export = { createSchedule };

   


