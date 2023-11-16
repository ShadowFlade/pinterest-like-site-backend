var axios = require('axios');
var data = JSON.stringify({
	collection: 'pins',
	database: 'pinterest',
	dataSource: 'Cluster0',
	projection: {
		_id: 1,
	},
});

var config = {
	method: 'post',
	url: 'https://eu-west-2.aws.data.mongodb-api.com/app/data-vmptm/endpoint/data/v1/action/findOne',
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Request-Headers': '*',
		'api-key': 'O5848x9DamkHHc1F441zQYYc4ttGcNjxGuRQrjmr6qKxfaqoAhojjcfC8Qcg9ZOk',
	},
	data: data,
};

axios(config)
	.then(function (response) {
		console.log(JSON.stringify(response.data));
	})
	.catch(function (error) {
		console.log(error);
	});
