import path from 'path';

import Datastore from 'nedb';

import { curryN, isNil } from 'ramda';

interface FindPayload { query: object; docs?: object[]; err?: object; }

/**
 * Executes a find query on passed datastore and returns a promise
 * that resolves with the documents.
 *
 * @param db {Datastore}
 * @param query {Object}
 *
 * @return {Object}
 */
const find: (db: Datastore, query: object) => Promise<FindPayload> = (db, query) =>
  new Promise((resolve, reject) =>
    db.find(query, (err, docs) => isNil(err) ? resolve({ docs, query }) : reject({ err, query })),
  );

interface FindByPayload { query: object; doc?: object; err?: Error; }

/**
 * Executes a find one query on passed datastore and returns a promise
 * that resolves with the document.
 *
 * @param db {Datastore}
 * @param query {Object}
 *
 * @return {Object}
 */
const findBy: (db: Datastore, query: object) => Promise<FindByPayload> = (db, query) =>
  new Promise((resolve, reject) =>
    db.findOne(query, (err, doc) => isNil(err) ? resolve({ doc, query }) : reject({ err, query })),
  );

interface CountPayload { query: object; count?: number; err?: Error; }

/**
 * Executes a count on passed datastore and returns a promise that resolves
 * with the count result.
 *
 * @param db {Datastore}
 * @param query {Object}
 *
 * @return {Object}
 */
const count: (db: Datastore, query: object) => Promise<CountPayload> = (db, query = {}) =>
  new Promise((resolve, reject) =>
    db.count(query, (err, count) => isNil(err) ? resolve({ count, query }) : reject({ err, query })),
  );

interface InsertPayload { doc?: object; err?: Error; }

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
const insert: (db: Datastore, doc: object) => Promise<InsertPayload> = (db, doc) =>
  new Promise((resolve, reject) =>
    db.insert(doc, (err, newDoc) => isNil(err) ? resolve({ doc: newDoc }) : reject({ err, doc })),
  );

interface UpdatePayload {
  updatedCount?: number;
  affectedDocs?: object | object[];
  upsert?: boolean;
  err?: Error;
  query?: object;
  update?: object;
  options?: Nedb.UpdateOptions;
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
const update: (db: Datastore, query: object, update: object, options: Nedb.UpdateOptions) => Promise<UpdatePayload> =
  (db, query, update, options = {}) => new Promise((resolve, reject) =>
    db.update(query, update, options, (err, updatedCount, affectedDocs, upsert) =>
      isNil(err) ? resolve({ updatedCount, affectedDocs, upsert }) : reject({ err, query, update, options }),
    ),
  );

interface DestroyPayload {
  destroyedCount?: number;
  err?: Error;
  query?: object;
  update?: object;
  options?: Nedb.RemoveOptions;
}

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
const destroy: (db: Datastore, query: object, options: Nedb.RemoveOptions) => Promise<DestroyPayload> =
  (db, query, options = {}) => new Promise((resolve, reject) =>
    db.remove(query, options, (err, destroyedCount) =>
      isNil(err) ? resolve({ destroyedCount }) : reject({ err, query, update, options }),
    ),
  );

interface Table {
  name: string;
  store: Datastore;
  find: (query: object) => Promise<FindPayload>;
  findBy: (query: object) => Promise<FindByPayload>;
  count: (query: object) => Promise<CountPayload>;
  insert: (doc: object) => Promise<InsertPayload>;
  update: (query: object, update: object, options: Nedb.UpdateOptions) => Promise<UpdatePayload>;
  destroy: (query: object, options: Nedb.RemoveOptions) => Promise<DestroyPayload>;
}

/**
 * Loads the datastore for the passed name, and wraps utility
 * functions in object to interact with store.
 *
 * @param name {String}
 *
 * @return {Object}
 */
export const loadTable: (name: string) => Table = name => {
  const store = new Datastore({
    filename: path.join('~', '.trezor-ether-wallet', 'data', `${name}.db`),
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
