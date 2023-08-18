
const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar,
    TransferTransaction,
  } = require("@hashgraph/sdk");
const operatorConfig = require("./operator.json");
async function createAccount(){
    const myAccountId=operatorConfig.MY_ACCOUNT_ID;
    const myPrivateKey=operatorConfig.MY_PRIVATE_KEY;
    const client =Client.forTestnet();
    client.setOperator(myAccountId,myPrivateKey);
    const newAccountPrivateKey=PrivateKey.generateED25519();
    const newAccountPublicKey=newAccountPrivateKey.publicKey;
    const newAccount=await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(new Hbar(10))
    .execute(client);
    const getReceipt=await newAccount.getReceipt(client);
    const newAccountId=getReceipt.accountId;
    console.log(`Account Id : ${newAccountId.toString()}`);
}
createAccount();

