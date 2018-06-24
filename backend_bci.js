var backend = { link: '<a href="https://blockchain.info/" target=_blank rel="noopener noreferrer">blockchain.info</a>', adr_page: 'https://blockchain.info/address/' };
function backend_balance_cb(res)
{
	console.log(res); this.balance_cb(parseFloat(res) / 1e8);
}
function backend_unspent_cb(data)
{
	var utxo = false; console.log(data);

	try{ data = JSON.parse(data); } catch(e){ data = {}; }

	if(typeof data.unspent_outputs != 'undefined')
	{
		var u = data.unspent_outputs; utxo = [];

		for(var i = 0; i < u.length; i++)
		{
			utxo.push({txid: u[i].tx_hash_big_endian, n: u[i].tx_output_n, amount: u[i].value, script: u[i].script});
		}
	}

	backend.unspent_cb(utxo);
}
function backend_send_cb(res)
{
	console.log(res);

	backend.send_cb(res.indexOf('Transaction Submitted') == 0 ? '' : res);
}
backend.get_balance = function(adr, cb)
{
	this.balance_cb = cb;

	js.ajax('GET', 'https://blockchain.info/q/addressbalance/' + adr, 'cors=true', backend_balance_cb);
};
backend.get_utxo = function(adr, cb)
{
	this.unspent_cb = cb;

	js.ajax('GET', 'https://blockchain.info/unspent?active=' + adr, 'cors=true', backend_unspent_cb);
};
backend.send = function(tx, cb)
{
	this.send_cb = cb;

	js.ajax('POST', 'https://blockchain.info/pushtx', 'tx=' + tx, backend_send_cb);
};
