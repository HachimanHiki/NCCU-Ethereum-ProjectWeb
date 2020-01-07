'use strict'

let contractAddress = $('#contractAddress');
let deployedContractAddressInput = $('#deployedContractAddressInput');
let loadDeployedContractButton = $('#loadDeployedContractButton');
let deployNewContractButton = $('#deployNewContractButton');

let killContractButton = $('#killContractButton')

let whoami = $('#whoami');
let whoamiButton = $('#whoamiButton');
let copyButton = $('#copyButton');

let update = $('#update');

let logger = $('#logger');

let borrow = $('#borrow');
let borrowButton = $('#borrowButton');
let borrowInternal = $('#borrowInternal')
let borrowInternalButton = $('#borrowInternalButton');
let sell = $('#sell');
let sellButton = $('#sellButton');
let lend = $('#lend');
let lendButton = $('#lendButton');
let withdraw = $('#withdraw');
let withdrawButton = $('#withdrawButton');

let ethRate = $('#ethRate');
let ethRateButton = $('#ethRateButton');

/*
let deposit = $('#deposit');
let depositButton = $('#depositButton');
*/

/*
let withdraw = $('#withdraw');
let withdrawButton = $('#withdrawButton');
*/

/*
let transferEtherTo = $('#transferEtherTo');
let transferEtherValue = $('#transferEtherValue');
let transferEtherButton = $('#transferEtherButton');
*/

let erc20Address = "";
let bankAddress = "";
let nowAccount = "";
let rate = 1.0;

function log(...inputs) {
	for (let input of inputs) {
		if (typeof input === 'object') {
			input = JSON.stringify(input, null, 2)
		}
		logger.html(input + '\n' + logger.html())
	}
}

// 載入使用者至 select tag
$.get('/accounts', function (accounts) {
	for (let account of accounts) {
		whoami.append(`<option value="${account}">${account}</option>`)
	}
	nowAccount = whoami.val();

	update.trigger('click')

	log(accounts, '以太帳戶')
})

// 當按下載入既有合約位址時
loadDeployedContractButton.on('click', function () {
	loadBank(deployedContractAddressInput.val())
})

// 當按下部署合約時
deployNewContractButton.on('click', function () {
	newBank()
})

// 當按下登入按鍵時
whoamiButton.on('click', async function () {

	nowAccount = whoami.val();

	update.trigger('click')

})

// 當按下複製按鍵時
copyButton.on('click', function () {
	let textarea = $('<textarea />')
	textarea.val(whoami.val()).css({
		width: '0px',
		height: '0px',
		border: 'none',
		visibility: 'none'
	}).prependTo('body')

	textarea.focus().select()

	try {
		if (document.execCommand('copy')) {
			textarea.remove()
			return true
		}
	} catch (e) {
		console.log(e)
	}
	textarea.remove()
	return false
})

// 當按下更新按鍵時
// TODO: update coin balance
update.on('click', function () {
	if (bankAddress != "") {
		$.get('/allBalance', {
			address: bankAddress,
			erc20Address: erc20Address,
			account: nowAccount
		}, function (result) {
			log({
				address: nowAccount,
				ethBalance: result.ethBalance,
				accountTokenBalance: result.accountTokenBalance,
				borrowEtherBalance: result.borrowEtherBalance,
				tokenBalance: result.tokenBalance,
				withdrawBalance: result.withdrawBalance,
				lockBalance: result.lockBalance
			})
			log('更新帳戶資料')

			$('#ethBalance').text('以太帳戶餘額 (ETH): ' + result.ethBalance)
			$('#accountTokenBalance').text('Token帳戶餘額： ' + result.accountTokenBalance)
			$('#borrowEtherBalance').text('ETH借款額度 (ETH): ' + result.borrowEtherBalance)
			$('#tokenBalance').text('合約Token 餘額: ' + result.tokenBalance)
			$('#withdrawBalance').text('可提領Token 餘額: ' + result.withdrawBalance)
			$('#lockBalance').text('上鎖Token 餘額: ' + result.lockBalance)
		})
	}
	else {
		$.get('/balance', {
			account: nowAccount
		}, function (result) {
			$('#ethBalance').text('以太帳戶餘額 (ETH): ' + result.ethBalance)
			$('#accountTokenBalance').text('Token帳戶餘額： ')
			$('#borrowEtherBalance').text('ETH借款額度 (ETH): ')
			$('#tokenBalance').text('合約Token 餘額: ')
			$('#withdrawBalance').text('可提領Token 餘額: ')
			$('#lockBalance').text('上鎖Token 餘額: ')
		})
	}
})

/*
// 當按下存款按鍵時
depositButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面 
	waitTransactionStatus();
	// 存款
	$.post('/deposit', {
		address: bankAddress,
		account: nowAccount,
		value: deposit.val()
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.DepositEvent.returnValues, '存款成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})

})
*/

/*
// 當按下提款按鍵時
withdrawButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 提款
	$.post('/withdraw', {
		address: bankAddress,
		account: nowAccount,
		value: parseInt(withdraw.val(), 10)
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.WithdrawEvent.returnValues, '提款成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})
})
*/

/*
// 當按下轉帳按鍵時
transferEtherButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 轉帳
	$.post('/transfer', {
		address: bankAddress,
		account: nowAccount,
		to: transferEtherTo.val(),
		value: parseInt(transferEtherValue.val(), 10)
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.TransferEvent.returnValues, '轉帳成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})
})
*/

// 載入bank合約
function loadBank(address) {
	if (!(address === undefined || address === null || address === '')) {
		$.get('/contract', {
			address: address
		}, function (result) {
			if (result.bank != undefined) {
				bankAddress = address;

				contractAddress.text('合約位址:' + address)
				log(result.bank, '載入合約')

				update.trigger('click')
			}
			else {
				log(address, '載入失敗')
			}
		})
	}
}

// 新增bank合約
async function newBank() {

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()

	await $.post('/deployERC20', {
		account: nowAccount
	}, function (result) {
		if (result.contractAddress) {
			log(result, '部署合約')

			erc20Address = result.contractAddress
		}
	})

	distributeERC20(erc20Address)

	$.post('/deploy', {
		account: nowAccount,
		erc20Address: erc20Address
	}, function (result) {
		if (result.contractAddress) {
			log(result, '部署合約')

			// 更新合約介面
			bankAddress = result.contractAddress
			contractAddress.text('合約位址:' + result.contractAddress)
			deployedContractAddressInput.val(result.contractAddress)

			update.trigger('click');

			// 更新介面
			doneTransactionStatus();
		}
	})
}

function waitTransactionStatus() {
	$('#accountStatus').html('帳戶狀態 <b style="color: blue">(等待交易驗證中...)</b>')
}

function doneTransactionStatus() {
	$('#accountStatus').text('帳戶狀態')
}

function distributeERC20(erc20Address){
	$.post('/distributeERC20', {
		erc20Address: erc20Address
	}, function (result) {
		console.log(erc20Address);
	})
}


async function unlockAccount() {
	let password = prompt("請輸入你的密碼", "");
	if (password == null) {
		return false;
	}
	else {
		return $.post('/unlock', {
			account: nowAccount,
			password: password
		})
			.then(function (result) {
				if (result == 'true') {
					return true;
				}
				else {
					alert("密碼錯誤")
					return false;
				}
			})
	}
}

borrowButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 轉帳
	$.post('/borrow', {
		address: bankAddress,
		erc20Address: erc20Address,
		account: nowAccount,
		rate: rate,
		value: parseInt(borrow.val(), 10)
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.GuarantyToken.returnValues, '借貸成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})
})
//使用合約內的Token借Ether
borrowInternalButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 轉帳
	$.post('/borrowinternal', {
		address: bankAddress,
		account: nowAccount,
		rate: rate.val(),
		value: parseInt(borrowInternal.val(), 10)
	}, function (result) {
		
		if (result.events !== undefined) {
			log(result.events.GuarantyToken.returnValues, '借貸成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})
})
// 當按下賣Ether按鍵時
sellButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 轉帳
	$.post('/sell', {
		address: bankAddress,
		account: nowAccount,
		rate: rate,
		value: parseInt(sell.val(), 10)
	}, function (result) {
		
		if (result.events !== undefined) {
			log(result.events.SellETH.returnValues, '販賣成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})
})

lendButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面 
	waitTransactionStatus();
	// 存Token
	$.post('/lend', {
		address: bankAddress,
		erc20Address: erc20Address,
		account: nowAccount,
		value: parseInt(lend.val(), 10)
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.LendERC20.returnValues, '存款成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})

})

withdrawButton.on('click', async function () {

	if (bankAddress == "") {
		return;
	}

	// 解鎖
	let unlock = await unlockAccount();
	if (!unlock) {
		return;
	}

	// 更新介面
	waitTransactionStatus()
	// 提款
	$.post('/withdraw', {
		address: bankAddress,
		account: nowAccount,
		value: parseInt(withdraw.val(), 10)
	}, function (result) {
		if (result.events !== undefined) {
			log(result.events.WithdrawERC20.returnValues, '提款成功')

			// 觸發更新帳戶資料
			update.trigger('click')

			// 更新介面 
			doneTransactionStatus()
		}
		else {
			log(result)
			// 更新介面 
			doneTransactionStatus()
		}
	})
})

ethRateButton.on('click', function () {
	waitCheckEthRate()

	checkEthRate()

	doneCheckEthRate()
})
function waitCheckEthRate(){
	$('#ethRateTitle').html('ETH匯率 (USDT) <b style="color: blue">(等待中...)</b>');
}
function doneCheckEthRate(){
	$('#ethRateTitle').text('ETH匯率 (USDT)');
}
function checkEthRate(){
	$.get('/checkETHrate', {
		// nothing
	},function (result) {
		rate = result.rate;
		ethRate.html('當前匯率：<b style="color: blue"> ' + result.rate + ' </b>');
		log(result.rate, 'ETH 匯率');
	})
}