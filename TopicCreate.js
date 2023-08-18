
const{
    PrivateKey,    
    AccountId,  
    Client,   
    TopicCreateTransaction,   
    AccountCreateTransaction,   
    TopicMessageSubmitTransaction,   
    PublicKey,   
    TransferTransaction   
     } = require("@hashgraph/sdk");   
     const operatorConfig = require("./operator.json");   
    const myAccountId=operatorConfig.MY_ACCOUNT_ID;    
    const myPrivateKey=PrivateKey.fromString(operatorConfig.MY_PRIVATE_KEY);    
     const client = Client.forTestnet();   
    client.setOperator(myAccountId,myPrivateKey);  
    async function topicCreate(){   
        const topicCreateTx = await new TopicCreateTransaction()
        .setSubmitKey(myPrivateKey.publicKey)
        .execute(client);  
    //Sign with the client operator private key and submit the transaction to a Hedera network  
    //const txResponse = await topicCreateTx.execute(client);  
    //Request the receipt of the transaction 
    const receipt = await topicCreateTx.getReceipt(client); 
    const newTopicId = receipt.topicId; 
    console.log("The new topic ID is " + newTopicId);   
    let submitMsgTx = await new TopicMessageSubmitTransaction({   
        topicId: newTopicId,   
        message: "Hedera is best",   
      })   
      .freezeWith(client)   
      .sign(myPrivateKey);   
    let submitMsgTxSubmit = await submitMsgTx.execute(client);   
    // Get the receipt of the transaction    
    let getReceipt = await submitMsgTxSubmit.getReceipt(client);    
    // Get the status of the transaction  
    const transactionStatus = getReceipt.status;   
    console.log("The message transaction status " + transactionStatus.toString());
    }   
    topicCreate();
    
     