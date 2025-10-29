//** ELYSIA TYPE VALIDATION IMPORT
import { t } from "elysia";



export const useEnergySchema = {
	body: 
		t.Object({
            username: t.String()
		}),

        headers: t.Object({ 
            "x-api-key": t.String()
        }), 
};
