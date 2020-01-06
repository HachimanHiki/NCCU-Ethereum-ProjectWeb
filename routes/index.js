const express = require('express');
const router = express.Router();

const Web3 = require('web3');
const web3 = new Web3('http://localhost:8545');

const contract = require('../contract/Defi.json');
const tokenContract = require('../contract/ProjectToken.json');

/* GET home page. */
router.get('/', async function (req, res, next) {
	res.render('index')
});

//get accounts
router.get('/accounts', async function (req, res, next) {
	let accounts = await web3.eth.getAccounts()
	res.send(accounts)
});

//login
router.get('/balance', async function (req, res, next) {
	let ethBalance = await web3.eth.getBalance(req.query.account)
	res.send({
		ethBalance: web3.utils.fromWei(ethBalance, 'ether')
	})
});

//balance
router.get('/allBalance', async function (req, res, next) {
	let bank = new web3.eth.Contract(contract.abi);
	let erc20 = new web3.eth.Contract(tokenContract.abi);
	bank.options.address = req.query.address;
	erc20.options.address = req.query.erc20Address;

	let ethBalance = await web3.eth.getBalance(req.query.account)
	let accountTokenBalance = await erc20.methods.balanceOf(req.query.account).call()
	let borrowEtherBalance = await bank.methods.getBorrowEther().call({ from: req.query.account })
	let tokenBalance = await bank.methods.getTokenBalance().call({ from: req.query.account })
	let withdrawBalance = await bank.methods.getUnlockTokenBalance().call({ from: req.query.account })
	let lockBalance = await bank.methods.getLockedTokenBalance().call({ from: req.query.account })

	res.send({
		ethBalance: web3.utils.fromWei(ethBalance, 'ether'),
		accountTokenBalance: web3.utils.fromWei(accountTokenBalance, 'ether'),
		borrowEtherBalance: web3.utils.fromWei(borrowEtherBalance, 'ether'),
		tokenBalance: web3.utils.fromWei(tokenBalance, 'ether'),
		withdrawBalance: web3.utils.fromWei(withdrawBalance, 'ether'),
		lockBalance: web3.utils.fromWei(lockBalance, 'ether')
	})
});

//contract
router.get('/contract', function (req, res, next) {
	let bank = new web3.eth.Contract(contract.abi);
	bank.options.address = req.query.address;
	res.send({
		bank: bank
	})
});

//unlock account
router.post('/unlock', function (req, res, next) {
	web3.eth.personal.unlockAccount(req.body.account, req.body.password, 60)
		.then(function (result) {
			res.send('true')
		})
		.catch(function (err) {
			res.send('false')
		})
});

//deploy defi contract
router.post('/deploy', function (req, res, next) {
	let bank = new web3.eth.Contract(contract.abi);
	bank.deploy({
		data: contract.bytecode,
		arguments: [req.body.erc20Address]
	})
		.send({
			from: req.body.account,
			gas: 3400000
		})
		.on('receipt', function (receipt) {
			res.send(receipt);
		})
		.on('error', function (error) {
			res.send(error.toString());
		})
});

//deploy erc20 contract
router.post('/deployERC20', function (req, res, next) {
	let erc20 = new web3.eth.Contract(tokenContract.abi);
	erc20.deploy({
		data: tokenContract.bytecode
	})
		.send({
			from: req.body.account,
			gas: 3400000
		})
		.on('receipt', function (receipt) {
			res.send(receipt);
		})
		.on('error', function (error) {
			res.send(error.toString());
		})
});

router.post('/distributeERC20', async function (req, res, next) {
	let erc20 = new web3.eth.Contract(tokenContract.abi);
	erc20.options.address = req.body.erc20Address;
	let accounts = await web3.eth.getAccounts();
	let totalSupply = await erc20.methods.balanceOf(accounts[0]).call();
	totalSupply = web3.utils.fromWei(totalSupply, 'ether');
	totalSupply = (totalSupply / 10).toString();
	totalSupply = web3.utils.toWei(totalSupply, 'ether');

	accounts.forEach(function(x){
		erc20.methods.transfer(x, totalSupply).send({
			from: accounts[0]
		});
	})
	res.send()
});

/*
//deposit ether
router.post('/deposit', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.deposit().send({
    from: req.body.account,
    gas: 3400000,
    value: web3.utils.toWei(req.body.value, 'ether')
  })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});
*/

/*
//withdraw ether
router.post('/withdraw', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.withdraw(req.body.value).send({
    from: req.body.account,
    gas: 3400000
  })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});
*/

/*
//transfer ether
router.post('/transfer', function (req, res, next) {
  let bank = new web3.eth.Contract(contract.abi);
  bank.options.address = req.body.address;
  bank.methods.transfer(req.body.to, req.body.value).send({
    from: req.body.account,
    gas: 3400000
  })
    .on('receipt', function (receipt) {
      res.send(receipt);
    })
    .on('error', function (error) {
      res.send(error.toString());
    })
});
*/

//withdraw Token
router.post('/withdraw', function (req, res, next) {
	let bank = new web3.eth.Contract(contract.abi);
	bank.options.address = req.body.address;
	bank.methods.withdrawERC20(web3.utils.toWei(req.body.value, 'ether')).send({
		from: req.body.account,
		gas: 3400000
	})
		.on('receipt', function (receipt) {
			res.send(receipt);
		})
		.on('error', function (error) {
			res.send(error.toString());
		})
});
//deposit Token
router.post('/deposit', function (req, res, next) {
	let bank = new web3.eth.Contract(contract.abi);
	bank.options.address = req.body.address;
	bank.methods.lendERC20(web3.utils.toWei(req.body.value, 'ether')).send({
		from: req.body.account,
		gas: 3400000,
	})
		.on('receipt', function (receipt) {
			res.send(receipt);
		})
		.on('error', function (error) {
			res.send(error.toString());
		})
});

//sell ether
router.post('/sell', function (req, res, next) {
	let bank = new web3.eth.Contract(contract.abi);
	bank.options.address = req.body.address;
	bank.methods.sellETH(req.body.rate, web3.utils.toWei(req.body.value, 'ether')).send({
		from: req.body.account,
		gas: 3400000
	})
		.on('receipt', function (receipt) {
			res.send(receipt);
		})
		.on('error', function (error) {
			res.send(error.toString());
		})
});

//borrow ether(存Token至合約借Ether)
router.post('/borrow', function (req, res, next) {
	let bank = new web3.eth.Contract(contract.abi);
	bank.options.address = req.body.address;
	
	bank.methods.depositETHAndGuaranty(req.body.rate, web3.utils.toWei(req.body.value, 'ether')).send({
		from: req.body.account,
		gas: 3400000
	})
	.on('receipt', function (receipt) {
		res.send(receipt);
	})
	.on('error', function (error) {
		res.send(error.toString());
	})
});
//borrow 使用合約內的Token借Ether
router.post('/borrowinternal', function (req, res, next) {
	let bank = new web3.eth.Contract(contract.abi);
	bank.options.address = req.body.address;
	bank.methods.guarantyETH(req.body.rate, web3.utils.toWei(req.body.value, 'ether')).send({
		from: req.body.account,
		gas: 3400000
	})
		.on('receipt', function (receipt) {
			res.send(receipt);
		})
		.on('error', function (error) {
			res.send(error.toString());
		})
});
module.exports = router;
