import { createHash } from 'crypto';

export function hash(string: string) {
  return createHash('sha512')
    .update(string)
    .digest('base64');
}
