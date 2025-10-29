import { t } from "elysia";

/**
 * Schema for validating SoulMetaData.
 *
 * @type {Object}
 * @property {string} genre1 - The first genre.
 * @property {string} genre2 - The second genre.
 * @property {string} genre3 - The third genre.
 * @property {string} animal1 - The first animal.
 * @property {string} horoscope - The horoscope.
 */
export const soulMetaDataSchema = {
    headers: t.Object({ 
        authorization: t.String() }), 
    body: t.Object({
        genre1: t?.String(),
        genre2: t?.String(),
        genre3: t?.String(),
        animal1: t?.String(),
        animal2: t?.String(),
        animal3: t?.String(),
        horoscope: t?.String(),
    })
}
