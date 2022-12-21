const Authorities = [
    //authority here
  ]
  
  const bridgeContracts = {
    "97" : "0xBa727B578bDC7B9e28397e3Aa73d38e3244e2931",  // BSC test net
    "444" : "0x156FD40628C60c2Bd61a79F6FA475B3Eb4177533", //frenchain testnet
    "5": "0x5cc5EfbA0901eB27CB73173b515eb6Ba6285a54F",// Goerli test net
  };
  
  const Networks = {
    "97" : "Binance Smart Chain testnet",  // BSC test net
    "56" : "Binance Smart Chain",  // BSC main net
    "1" : "Ethereum",   // ETH main net
    "444" : "Frenchain Testnet", //FrenChain TestNet
    "5" : "Goerli Testnet", //GOERLI Testnet
  };
  
  const Tokens = {
    "FREN" : {
        "444" : "0x8bF9D7C3FCD19FF4F24C7ec41c94d60346Cc7dB2", //Frenchain testnet
        "97": "0x5fe83cF8117511478DC23659e64794Ee12644dD8", //BSC TESTNET
        "5": "0x27c44cd9ED0C7cb9F24C4c208D44A28686B2b67e", //GOERLI TESTNET
    }
  }
  // var chainId = parseInt(window.ethereum.chainId, 16)
  
  $(function(){
    
    $('li.dropdown > a').on('click',function(event){
      
      event.preventDefault()
      
      $(this).parent().find('ul').first().toggle(300,'swing');
      
      $(this).parent().siblings().find('ul').hide(200);
      
      $(this).parent().find('ul').mouseleave(function(){  
        var thisUI = $(this);
        $('html').click(function(){
          thisUI.hide();
          $('html').unbind('click');
        });
      });
      
      
    });
  });
  
  
  function myMenu() {
      var x = document.getElementById("top-nav");
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    }
  
  const modals = document.querySelectorAll('[data-modal]');
  
  modals.forEach(function(trigger) {
    trigger.addEventListener('click', function(event) {
      event.preventDefault();
      const modal = document.getElementById(trigger.dataset.modal);
      modal.classList.add('open');
      const exits = modal.querySelectorAll('.modal-exit');
      exits.forEach(function(exit) {
        exit.addEventListener('click', function(event) {
          event.preventDefault();
          modal.classList.remove('open');
        });
      });
    });
  });
  function showNetwork(btn, chainId)    
  {  
    document.getElementById("blockNamesFirst").innerHTML = btn.innerHTML
  }
  function toggleTextFirst(btn, chainId)    
  {  
    document.getElementById("blockNameFirst").innerHTML = btn.innerHTML;
  }
  function toggleTextSecond(btn, chainId)    
  {  
    toChain = chainId;
    document.getElementById("blockNameSecond").innerHTML = btn.innerHTML
  }
  // function toggleAssets(btn)    
  // {  
  //     var parent = document.querySelector('#crypto-block')
  //     var childname = parent.querySelector('#crypto-name')
  //     var childimg = parent.querySelector('#crypto-img')
  //     var blockimg = document.getElementById("blockImg").firstElementChild
  //     document.getElementById("blockNameFirst").innerHTML = childname.innerHTML
  //     blockimg.firstElementChild.srcset = childimg.src
  // }
  function toggleAssets(btn)    
  {  
      var cryptoimg = btn.firstElementChild.firstElementChild.lastElementChild
      var name = btn.firstElementChild.lastElementChild.lastElementChild
  
      var blockimg = document.getElementById("blockImg").firstElementChild
  
      document.getElementById("blockNameFirst").innerHTML = name.innerHTML
      blockimg.firstElementChild.srcset = cryptoimg.src
  }
  
  function toggleAssetsTop(btn)    
  {  
      var cryptoimg = btn.firstElementChild.firstElementChild.lastElementChild
      var name = btn.firstElementChild.lastElementChild.firstElementChild
  
      var blockimg = document.getElementById("asset-img").firstElementChild
  
      document.getElementById("asset-shot-name").innerHTML = name.innerHTML
      blockimg.firstElementChild.srcset = cryptoimg.src
  }
  function email_test(input) {
      return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
  }
  
  
  
  
  
  
  
  // ============================================== Metamask ======================================
  
  
  var chainId;
  var currentAccount = null;
  var step = 0;
  var txHash = "";
  let txChain = 0;
  let toChain = 97; // destination chain
  
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    handleEthereum();
    console.log("1")
  } else {
    window.addEventListener('ethereum#initialized', handleEthereum, {
      once: true,
    });
  
    // If the event is not dispatched by the end of the timeout,
    // the user probably doesn't have MetaMask installed.
    setTimeout(handleEthereum, 3000); // 3 seconds
  }
  
  
  
  async function handleEthereum() {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      console.log('Ethereum successfully detected!');
      // Access the decentralized web!
  
  /**********************************************************/
  /* Handle chain (network) and chainChanged (per EIP-1193) */
  /**********************************************************/
  
  chainId = await ethereum.request({ method: 'eth_chainId' });
  handleChainChanged(chainId);
  
  ethereum.on('chainChanged', handleChainChanged);
  
  function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    //window.location.reload();
    chainId = parseInt(_chainId, 16);
    let network = Networks[chainId];
    if (toChain == chainId && step == 2) {
      step = 3;
      document.getElementById("main_button").innerHTML = "Claim tokens";
    }
    document.getElementById("blockNameFirst").innerHTML = network;
    document.getElementById("blockNamesFirst").innerHTML = network;
    console.log("chainId:", chainId);
  }
  
  /***********************************************************/
  /* Handle user accounts and accountsChanged (per EIP-1193) */
  /***********************************************************/
  
  ethereum
    .request({ method: 'eth_accounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
      // Some unexpected error.
      // For backwards compatibility reasons, if no accounts are available,
      // eth_accounts will return an empty array.
      console.error(err);
    });
  
  // Note that this event is emitted on page load.
  // If the array of accounts is non-empty, you're already
  // connected.
  ethereum.on('accountsChanged', handleAccountsChanged);
  
  
  
    } else {
      console.log('Please install MetaMask!');
    }
  }
  
  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      console.log("currentAccount:", currentAccount);
      const limit = (string, length, end = "...") => {
        return string.length < length ? string : string.substring(0, length) + end
    }
      document.getElementById("owner-addy").innerHTML = limit(currentAccount, 7);
  
      // Do any other work!
      if (step == 0) {
        document.getElementById("main_button").innerHTML = "Bridge Now";
        step = 1;
      }
    }
  }

  
  async function clickButton(_btn) {
    if (!currentAccount) {  // connect ot metamask
      connect();
    } else if (step == 1) { //Swap
      let amount = web3.utils.toWei(document.getElementById("amount").value); // TODO use decimals of tokens
      let token = document.getElementById("asset-shot-name").innerText;
      token = Tokens[token][chainId];
      let bridge_addr = bridgeContracts[chainId];
      if (!token || !bridge_addr) {
        console.log("Wrong token or bridge");
        alert("ERROR: Wrong token or bridge!");
        return;
      }
      if (chainId == toChain) {
        console.log("Swap to the same chain is not allowed");
        alert("ERROR: wap to the same chain is not allowed!");
        return;      
      }
  
      txChain = chainId;
      var gas = await web3.eth.getGasPrice();
      console.log(gas);
      gas = parseInt(gas*1.1).toString(); // add 10% to average gas price
      document.getElementById("gasprice").innerHTML = gas;
      let value = 0;
      let params = {
        from: currentAccount, //addr[0]
        gasPrice: gas,//parseInt(gas*1),//web3.utils.toWei(10, "Gwei"),
        gas: 100000,
      };    
      if (token.slice(0,-2) == "0x00000000000000000000000000000000000000") {
        value = amount;
      } else {
        let tokens = new web3.eth.Contract(token_abi, token, params);
        let allowed = await tokens.methods.allowance(currentAccount, bridge_addr).call();
        if (allowed < amount) {
          await tokens.methods.approve(bridge_addr,"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff").send();
        }
      }
  
      let bridge = new web3.eth.Contract(bridge_abi, bridge_addr, params);
      bridge.methods.depositTokens(token, amount, toChain).send({value: value})
      .then(tx => {
        console.log(tx);
        txHash = tx.transactionHash;
        step = 2;
        document.getElementById("amount").value = txHash;
        document.getElementById("main_button").innerHTML = "Switch network to claim";
  
      })
      .catch(e => {
        console.log(e);
        alert("ERROR: depositTokens failed!");
      });
    } else if (step == 3) { // claim token
      signatures = [];
      let i = 0;
      var respJSON;
      var tx = document.getElementById("amount").value;
      while (i < Authorities.length) {
        var url = Authorities[i]+"tx="+tx+"&chain="+txChain;
        var resp = await fetch(url);
        respJSON = await resp.json();
        if (!respJSON.isSuccess) {
          console.log("ERROR authorization: "+respJSON.message);
          alert("ERROR: authorization failed!");
          return; 
        }
        signatures.push(respJSON.signature);
        i++;
      }
      // call smart contract
      var gas = await web3.eth.getGasPrice();
      gas = parseInt(gas*1.1).toString(); // add 10% to average gas price    
      let params = {
        from: currentAccount, //addr[0]
        gasPrice: gas,//parseInt(gas*1),//web3.utils.toWei(10, "Gwei"),
        value: 0,
        gas: 200000,
      };    
      let bridge = new web3.eth.Contract(bridge_abi, respJSON.bridge, params);
      //bridge.methods.claimMultiSig(respJSON.token, tx, respJSON.to, respJSON.value, txChain, signatures).send(params)
      bridge.methods.claim(respJSON.token, tx, respJSON.to, respJSON.value, txChain, signatures).send(params)
      .then(tx => {
        console.log(tx);
        txHash = "";
        step = 1;
        txChain = 0;
        document.getElementById("amount").value = "";
        document.getElementById("main_button").innerHTML = "Swap";
  
      })
      .catch(e => {
        console.log(e);
        alert("ERROR: claimMultiSig failed!");
      });
    }
  }
  
  // While you are awaiting the call to eth_requestAccounts, you should disable
  // any buttons the user can click to initiate the request.
  // MetaMask will reject any additional requests while the first is still
  // pending.
  function connect() {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
    }
