//** RETHINK DB IMPORTS
import rt from 'rethinkdb'
import { getRethinkDB } from '../db/rethink';

//** TYPE INTERFACE IMPORTS
import { Contracts } from '../contract.services/contracts.interface'

//** TOKEN SERVICE IMPORT


class ContractService {



    public async getContracts(): Promise<Contracts[] | Error> {
        try {
            const connection: rt.Connection = await getRethinkDB();
            const query: rt.Cursor = await rt.db('admin')
                .table('contracts')
                .orderBy(rt.desc('lastUpdate'))
                .limit(2)
                .run(connection);

            const contracts: Contracts[] = await query.toArray()

            return contracts as Contracts[]
        } catch (error: any) {
            console.error("Error getting latest update:", error);
            throw error;
        }
    }
}
    
export default ContractService;
