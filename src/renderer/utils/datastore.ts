import path from 'path';

import DB from 'nedb';

import { curryN } from 'ramda';

type Optional<T> = { [P in keyof T]?: T[P] };

/**
 * Executes a find query on passed datastore and returns a promise
 * that resolves with the documents.
 *
 * @param db {Datastore}
 * @param query {Object}
 *
 * @return {Object}
 */
const find: <T = object, Q = object>(db: DB, query: Q) => Promise<{ records: T[] }> =
  (db, query) => new Promise((resolve, reject) =>
    db.find(query, (err, records) => err ? resolve({ records }) : reject(err)),
  );

/**
 * Executes a find one query on passed datastore and returns a promise
 * that resolves with the document.
 *
 * @param db {Datastore}
 * @param query {Object}
 *
 * @return {Object}
 */
const findBy: <T = object, Q = object>(db: DB, query: Q) => Promise<{ record: T }> =
  (db, query) => new Promise((resolve, reject) =>
    db.findOne(query, (err, record) => err ? resolve({ record }) : reject(err)),
  );

/**
 * Executes a count on passed datastore and returns a promise that resolves
 * with the count result.
 *
 * @param db {Datastore}
 * @param query {Object}
 *
 * @return {Object}
 */
const count: <Q = object>(db: DB, query: Q) => Promise<{ count: number }> =
  (db, query = {}) => new Promise((resolve, reject) =>
    db.count(query, (err, count) => err ? resolve({ count }) : reject(err)),
  );

/**
 * Executes an insert on passed datastore and attempts to insert passed
 * document into store. If the insert is successful the promise resolves with
 * the inserted document.
 *
 * @param db {Datastore}
 * @param doc {Object}
 *
 * @return {Object}
 */
const insert: <T = object>(db: DB, item: T) => Promise<{ record: T }> =
  (db, item) => new Promise((resolve, reject) =>
    db.insert(item, (err, record) => err ? resolve({ record }) : reject(err)),
  );

interface UpdateResult<T = object> {
  updatedCount: number;
  affectedDocs?: T | T[];
  upsert?: boolean;
}

/**
 * Executes an update on passed datastore and attempts to update values on
 * documents in the store that match the query. If the insert is successful
 * the promise resolves with the update documents.
 *
 * @param db {Datastore}
 * @param query {Object}
 * @param update {Object}
 * @param options {Object}
 *  @option multi {Boolean}
 *  @option upsert {Boolean}
 *
 * @return {Object}
 */
const update: <T = object, Q = object>(db: DB, query: Q, update: Optional<T>, options: Nedb.UpdateOptions) => Promise<UpdateResult<T>> =
  (db, query, update, options = {}) => new Promise((resolve, reject) =>
    db.update(query, update, options, (err, updatedCount, affectedDocs, upsert) =>
      err ? resolve({ updatedCount, affectedDocs, upsert }) : reject(err),
    ),
  );

/**
 * Executes a remove on passed datastore and attempts to remove documents in
 * the store that match the query. If the insert is successful the promise resolves
 * with the count of removed documents.
 *
 * @param db {Datastore}
 * @param query {Object}
 * @param options {Object}
 *  @option multi {Boolean}
 *
 * @return {Object}
 */
const destroy: <Q = object>(db: DB, query: Q, options: Nedb.RemoveOptions) => Promise<{ destroyedCount: number }> =
  (db, query, options = {}) => new Promise((resolve, reject) =>
    db.remove(query, options, (err, destroyedCount) =>
      err ? resolve({ destroyedCount }) : reject(err),
    ),
  );

interface Table<T = object, Q = object> {
  name: string;
  store: DB;
  find: (query: Q) => Promise<{ records: T[] }>;
  findBy: (query: Q) => Promise<{ record: T }>;
  count: (query: Q) => Promise<{ count: number }>;
  insert: (item: T) => Promise<{ record: T }>;
  update: (query: Q, update: Optional<T>, options: Nedb.UpdateOptions) => Promise<UpdateResult<T>>;
  destroy: (query: Q, options: Nedb.RemoveOptions) => Promise<{ destroyedCount: number }>;
}

/**
 * Loads the datastore for the passed name, and wraps utility
 * functions in object to interact with store.
 *
 * @param name {String}
 *
 * @return {Object}
 */
export const loadTable: <T = object, Q = object>(name: string) => Table<T, Q> = name => {
  const store = new DB({
    filename: path.join(process.env.DATASTORE_PATH || '~/.trezor-ethereum-wallet/data', `${name}.db`),
    autoload: true,
  });

  return {
    name,
    store,
    find: curryN(2, find)(store),
    findBy: curryN(2, findBy)(store),
    count: () => count(store, {}),
    countOf: curryN(2, count)(store),
    insert: curryN(2, insert)(store),
    update: curryN(4, update)(store),
    destroy: curryN(3, destroy)(store),
  };
};
