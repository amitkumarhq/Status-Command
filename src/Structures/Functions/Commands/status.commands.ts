import DB from '../../Schemas/ClientDB.js';
import ms from 'ms';

/**Update the status data in the database */
export async function updateStatusDB(MemArr: any[]) {
	return setInterval(async () => {
		MemArr.push(await getMemoryUsage());

		if (MemArr.length >= 14) {
			MemArr.shift();
		}

		// Store in Database
		await DB.findOneAndUpdate({ Client: true }, {
			Memory: MemArr,

		}, { upsert: true });

	}, ms('5s')); //= 5000 (ms)

}

/**Get the process memory usage (in %) */
async function getMemoryUsage() {
	return (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2);

}
