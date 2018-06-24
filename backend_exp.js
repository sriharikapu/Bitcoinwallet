var backend = { link: '<a href="https://blockexplorer.com/" target=_blank rel="noopener noreferrer">blockexplorer.com</a>', adr_page: 'https://blockexplorer.com/address/' };
function backend_balance_cb(res)
{
	console.log(res);

	this.balance_cb(parseFloat(res) / 1e8);
}
function backend_unspent_cb(data)
{
	var u, utxo = false; console.log(data);

	try{ u = JSON.parse(data); } catch(e){ u = false; }

	if(u !== false)
	{
		utxo = [];

		for(var i = 0; i < u.length; i++)
		{
			utxo.push({txid: u[i].txid, n: u[i].vout, amount: u[i].amount * 1e8, script: u[i].scriptPubKey});
		}
	}
	backend.unspent_cb(utxo);
}
function backend_send_cb(res)
{
	console.log(res);

	try{ res = JSON.parse(res); } catch(e){ res = {}; }

	backend.send_cb(typeof res.txid != 'undefined' ? '' : 'request failed');
}
backend.get_balance = function(adr, cb)
{
	this.balance_cb = cb;

	js.ajax('GET', 'https://blockexplorer.com/api/addr/' + adr + '/balance', '', backend_balance_cb);
};
backend.get_utxo = function(adr, cb)
{
	this.unspent_cb = cb;

	js.ajax('GET', 'https://blockexplorer.com/api/addr/' + adr + '/utxo', '', backend_unspent_cb);
};
backend.send = function(tx, cb)
{
	this.send_cb = cb;

	js.ajax('POST', 'https://blockexplorer.com/api/tx/send', 'rawtx=' + tx, backend_send_cb);
};
