const providers = {
  97: 'https://bsctestapi.terminet.io/rpc', // BSC test net
  56: 'https://bsc-dataseed1.ninicoin.io', // BSC main net
  1: 'https://rpc.ankr.com/eth', // ETH main net
  5: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161	', // Goerli test net
  444: 'https://rpc-01tn.frenchain.app/' //FrenChain Testnet
};

const deposit_event_abi = [
  { type: 'address', name: 'token', internalType: 'address', indexed: true },
  { type: 'address', name: 'sender', internalType: 'address', indexed: true },
  { type: 'uint256', name: 'value', internalType: 'uint256', indexed: false },
  { type: 'uint256', name: 'toChainId', internalType: 'uint256', indexed: false },
  { type: 'address', name: 'toToken', internalType: 'address', indexed: false }
];

// call this function to get authorization signature
// params: txId = deposit transaction hash, fromChainId = chain ID where transaction was sent.
// returns: on success {isSuccess: true, message: sig.signature};
// on error: {isSuccess: false, message: error_message};
async function authorize(txId, fromChainId) {
  const provider = providers[fromChainId];
  const bridgeContract = bridgeContracts[fromChainId];
  if (!bridgeContract) {
    const msg = `No bridgeContract for chain ID: ${fromChainId}`;
    logger.error(msg);
    return { isSuccess: false, message: msg };
  }
  if (!provider) {
    const msg = `No provider for chain ID: ${fromChainId}`;
    logger.error(msg);
    return { isSuccess: false, message: msg };
  }
  const web3 = new Web3(provider);
  const lastBlock = await web3.eth.getBlockNumber();

  return web3.eth
    .getTransactionReceipt(txId)
    .then(receipt => {
      if (receipt && receipt.status) {
        if (lastBlock - receipt.blockNumber < blockConfirmations[fromChainId]) {
          const msg = `Confirming: ${lastBlock - receipt.blockNumber} of ${blockConfirmations[fromChainId]}`;
          return { isSuccess: false, message: msg };
        }

        for (let i = 0; i < receipt.logs.length; i++) {
          const element = receipt.logs[i];
          if (
            element.topics[0] == '0xf5dd9317b9e63ac316ce44acc85f670b54b339cfa3e9076e1dd55065b922314b' &&
            element.address == bridgeContract &&
            element.transactionHash == txId
          ) {
            element.topics.shift(); // remove
            const p = web3.eth.abi.decodeLog(deposit_event_abi, element.data, element.topics);
            const messageHash = web3.utils.soliditySha3(p.toToken, p.sender, p.value, txId, fromChainId, p.toChainId);
            sig = web3.eth.accounts.sign(messageHash, web3.eth.accounts.decrypt(keyStore, PW).privateKey);
            const ret = {
              isSuccess: true,
              signature: sig.signature,
              token: p.toToken,
              value: p.value,
              to: p.sender,
              chainId: p.toChainId,
              bridge: bridgeContracts[p.toChainId]
            };
            return ret;
          }
        }
      }
      const msg = `Wrong transaction hash: ${txId}`;
      logger.error(msg);
      return { isSuccess: false, message: msg };
    })
    .catch(err => {
      logger.error(err);
      return { isSuccess: false, message: err.toString() };
    });
}

module.exports.authorize = authorize;
