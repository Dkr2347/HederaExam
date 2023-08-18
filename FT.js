
const
{
TokenCreateTransaction,
Client,
TokenType,
TokenInfoQuery,
AccountBalanceQuery,
PrivateKey,
TokenSupplyType,
PublicKey,
 TransferTransaction,
 AccountCreateTransaction,
 Hbar,
 TokenAssociateTransaction
}= require('@hashgraph/sdk');
const operatorConfig = require("./operator.json");
const client =Client.forTestnet();
client.setOperator(operatorConfig.MY_ACCOUNT_ID,operatorConfig.MY_PRIVATE_KEY);
const oacid=operatorConfig.MY_ACCOUNT_ID;
const oprt=PrivateKey.fromString(operatorConfig.MY_PRIVATE_KEY);
const opbk=oprt.publicKey;
const prtk=PrivateKey.generateED25519();
const pbk=prtk.publicKey;
let tokenId;
let acid;
async function createToken(){
    const crt=await new AccountCreateTransaction()
                .setKey(pbk)
                .setInitialBalance(new Hbar(100))
                .execute(client);
    const res=await crt.getReceipt(client);
    acid=res.accountId;
    const tok=await new TokenCreateTransaction()
                    .setTokenName("SuperTokenHedera")
                    .setTokenType(TokenType.FungibleCommon)
                    .setTokenSymbol("STH")
                    .setAdminKey(opbk)
                    .setTreasuryAccountId(acid)
                    .setDecimals(2)
                    .setInitialSupply(35050)
                    .setMaxSupply(50000)
                    .setSupplyType(TokenSupplyType.Finite)
                    .setSupplyKey(pbk)
                    .freezeWith(client);
    const sign=await tok.sign(prtk);
    const tres=await sign.execute(client);
    const trec=await tres.getReceipt(client);
    tokenId=trec.tokenId;
    console.log(tokenId.toString());
    return tokenId.toString();
}
async function sendToken(){
    await createToken();
    const recpr="302e020100300506032b65700422042079abd60bb9c495ac2d7e43ac16d71857156f0d0b0d1fe9ef21fdc7b683d07246";
    const astr= await new TokenAssociateTransaction()
                        .setAccountId("0.0.475016")
                        .setTokenIds([tokenId])
                        .freezeWith(client)
                        .sign(PrivateKey.fromString(recpr));
    const asex=await astr.execute(client);
    const sndt=await new TransferTransaction()
                .addTokenTransfer(tokenId,acid,-2550)
                .addTokenTransfer(tokenId,"0.0.475016",2550)
                .freezeWith(client)
                .sign(prtk);
    const res=await sndt.execute(client);
    const rec=await res.getReceipt(client);
    console.log(rec.status.toString());
}
sendToken();
