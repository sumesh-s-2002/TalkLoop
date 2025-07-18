/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthand = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = pgm => {
  // ──────────────────────────────────────────────────────────────
  //  EXTENSIONS (uuid generation)
  // ──────────────────────────────────────────────────────────────
  pgm.createExtension('pgcrypto', { ifNotExists: true });

  // ──────────────────────────────────────────────────────────────
  //  USERS TABLE
  // ──────────────────────────────────────────────────────────────
  pgm.createTable('users', {
    id:            { type: 'uuid',  primaryKey: true, default: pgm.func('gen_random_uuid()') },
    email:         { type: 'text',  notNull: true, unique: true },
    username:      { type: 'text',  notNull: true, unique: true },
    password_hash: { type: 'text',  notNull: true },
    role:          { type: 'text',  notNull: true, default: 'user' },   // 'user' | 'admin'
    is_active:     { type: 'boolean', notNull: true, default: true },
    created_at:    { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    updated_at:    { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createIndex('users', 'email', { name: 'idx_users_email' });

  // ──────────────────────────────────────────────────────────────
  //  REFRESH_TOKENS TABLE
  // ──────────────────────────────────────────────────────────────
  pgm.createTable('refresh_tokens', {
    jti:         { type: 'uuid',  primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id:     { type: 'uuid',  notNull: true,
                   references: '"users"',
                   onDelete: 'cascade' },
    token_hash:  { type: 'text',  notNull: true },
    device_info: { type: 'text' },          
    ip_addr:     { type: 'inet' },   
    expires_at:  { type: 'timestamp', notNull: true },
    created_at:  { type: 'timestamp', notNull: true, default: pgm.func('now()') }
  });

  pgm.createIndex('refresh_tokens', 'user_id',   { name: 'idx_rt_user' });
  pgm.createIndex('refresh_tokens', 'jti', {name: 'idx_rt_jti'});
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = pgm => {
  pgm.dropTable('refresh_tokens');
  pgm.dropTable('users');
};
