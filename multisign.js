const {
    TransferTransaction,
    Hbar,
    Client,
    AccountCreateTransaction,
    AccountAllowanceApproveTransaction,
    PrivateKey,
    AccountId,
    TransactionId,
    AccountBalanceQuery
    }= require("@hashgraph/sdk");
    const operatorConfig = require("./operator.json");
    async function account1Details() {
        return account1Info;
    }
    async function account2Details() {
        return account2Info;
    }
    async function account3Details() {
        return account3Info;
    }
    const client =Client.forTestnet();
    client.setOperator(operatorConfig.MY_ACCOUNT_ID, PrivateKey.fromString(operatorConfig.MY_PRIVATE_KEY));
    client.setDefaultMaxTransactionFee(new Hbar(10));
    let account1Info = {};
    let account2Info = {};
    let account3Info = {};   
    async function createAccounts() {   
    const createAccount1Promise = createAccount(); 
    const createAccount2Promise = createAccount(); 
    const createAccount3Promise = createAccount();  
    account1Info = await createAccount1Promise; 
    account2Info = await createAccount2Promise; 
    account3Info= await createAccount3Promise; 
    return [account1Info, account2Info, account3Info]; 
    } 
    async function createAccount() { 
    let accountInfo = {}; // Create KeyPair  
    let privateKey = await PrivateKey.generateED25519Async();  
    let publicKey = privateKey.publicKey;  
    accountInfo['privateKey'] = privateKey.toString();  
    accountInfo['publickey'] =publicKey.toString(); 
    const newAccountTx=await new AccountCreateTransaction()
                        .setKey(publicKey)
                        .setInitialBalance(Hbar.from(100))
                        .execute(client);   
    //Request the receipt of the transaction   
    const receipt= await newAccountTx.getReceipt(client);   
    //Get the account ID   
    accountInfo['accountId'] = receipt.accountId.toString();   
    console.log('Newly Created Account info', accountInfo);  
    return accountInfo;   
    }   
    async function createAllowance(){
                await createAccounts();
        const tsc= new AccountAllowanceApproveTransaction()
                            .approveHbarAllowance(account1Info.accountId,account2Info.accountId,
                              Hbar.from(20))
                                   .freezeWith(client);   
        const signt=await tsc.sign(PrivateKey.fromString(account1Info.privateKey));
        const res= await signt.execute(client);
        const rec=await res.getReceipt(client);
     }    
    async function spendAllowance(){    
        await createAllowance();    
        const trs=await new TransferTransaction()   
                        .addApprovedHbarTransfer(account1Info.accountId,new Hbar(-20))    
                        .addHbarTransfer(account3Info.accountId,new Hbar(20))   
                        .setTransactionId(TransactionId.generate(account2Info.accountId))   
                        .freezeWith(client);    
        const signt=await trs.sign(PrivateKey.fromString(account2Info.privateKey));    
        const res=await signt.execute(client);    
        const rec=await res.getReceipt(client);    
        const status=rec.status;   
        console.log(status.toString());   
    try{   
        const trs1=await new TransferTransaction()   
        .addApprovedHbarTransfer(account1Info.accountId,new Hbar(-20))    
        .addHbarTransfer(account3Info.accountId,new Hbar(20))    
        .setTransactionId(TransactionId.generate(account2Info.accountId))    
        .freezeWith(client);    
    const signt1=await trs1.sign(PrivateKey.fromString(account2Info.privateKey));    
    const res1=await signt1.execute(client);    
    const rec1=await res1.getReceipt(client);   
    const status1=rec1.status;    
    console.log(status1.toString());}    
    catch(error){    
        console.log("transaction fail");   
    }  
    }    
    spendAllowance();