const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const server = express();

const db = knex({
	client: 'sqlite',
	useNullAsDefault: true,
	connection: {
		filename: './data/lambda.sqlite3'
	}
});

server.use(express.json());
server.use(helmet());

// endpoints here

server.get('/api/zoos/', async (req, res) => {
	try {
		const zoos = await db('zoos');
		res.status(200).json(zoos);
	} catch (error) {
		res.status(500).json({ error: 'The zoos invormation could not be retrived' });
	}
});

server.get('/api/zoos/:id', async (req, res) => {
	try {
		const zoo = await db('zoos').where({ id: req.params.id }).first();
		if (zoo) {
			res.status(200).json(zoo);
		} else {
			res.status(404).json({ message: "the specified id does't exists" });
		}
	} catch (error) {
		res.status(500).json({ error: 'error trying to get the zoo by id' });
	}
});

server.post('/api/zoos/', async (req, res) => {
	const body = req.body;
	if (body.name) {
		try {
			const [ result ] = await db('zoos').insert(req.body);
			const zoo = await db('zoos').where({ id: result }).first();
			res.status(201).json(zoo);
		} catch (error) {
			res.status(500).json({ error: 'There was a error trying to save the zoo to the database' });
		}
	} else {
		res.status(400).json({ error: 'Please provide a name for the zoo' });
	}
});

server.put('/api/zoos/:id', async (req, res) => {
	const body = req.body;
	const currentId = req.params.id;
	try {
		const result = await db('zoos').where({ id: currentId }).update(body);
		if (result > 0) {
			const zoo = await db('zoos').where({ id: currentId }).first(); //getting the zoo by id
			res.status(200).json(zoo); //retur the zoo with the specified id of request is sucesfully
		} else {
			res.status(404).json({ message: 'Record id not found' });
		}
	} catch (error) {
		res.status(500).json({ error: ' The zoo could not be modified' });
	}
});

const port = 3300;
server.listen(port, function() {
	console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
