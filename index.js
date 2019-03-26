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
	try {
		const [ result ] = await db('zoos').insert(req.body);

		res.status(201).json(result);
	} catch (error) {
		res.status(500).json({ error: 'There was a error trying to save the zoo to the database' });
	}
});

const port = 3300;
server.listen(port, function() {
	console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
