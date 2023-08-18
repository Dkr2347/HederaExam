
const {
    TransferTransaction,
    Hbar,
    Client,
    FileCreateTransaction,
    ContractCreateTransaction,
    ContractFunctionParameters,
    ContractExecuteTransaction,
    AccountCreateTransaction,
    AccountAllowanceApproveTransaction,
    PrivateKey,
    AccountId,
    TransactionId,
    AccountBalanceQuery
    }= require("@hashgraph/sdk");
    const operatorConfig = require("./operator.json");
    const contractJson=require("./artifact/HelloHedera.json");
    const acid=operatorConfig.MY_ACCOUNT_ID;
    const prtk=operatorConfig.MY_PRIVATE_KEY;
    const client =Client.forTestnet();
    client.setOperator(acid,prtk);
    const btcd=contractJson.data.bytecode.object;
    let cntid;
    async function deploycontract(){
        const file=await new FileCreateTransaction()
                        .setContents(btcd);
        const resf=await file.execute(client);
        const recf=await resf.getReceipt(client);
        const fileid=recf.fileId;
        const doct=await new ContractCreateTransaction()
                        .setBytecodeFileId(fileid)
                        .setGas(100000)
                        .setConstructorParameters(new ContractFunctionParameters().addString("Hello"));
        const res=await doct.execute(client);
        const rec=await res.getReceipt(client);
        cntid=rec.contractId;
        console.log(cntid.toString());
        return cntid.toString();
    }
async function callContract(){
    await deploycontract();
    const callc=await new ContractExecuteTransaction()
                    .setContractId(cntid)
                    .setGas(100000)
                    .setFunction("set_message",new ContractFunctionParameters()
                    .addString("Hello again")
                    //.addUint256(4).addUint256(5)
                    );
    const submt=await callc.execute(client);
    const tsid=submt.transactionId;
    console.log(tsid.toString());
    return tsid.toString();
}
callContract();


