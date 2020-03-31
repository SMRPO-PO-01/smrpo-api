import { BadRequestException } from '@nestjs/common';

const extractErrorMessages = errors => {
  let r = [];
  errors.forEach(err => {
    if (err.constraints) Object.keys(err.constraints).forEach(key => r.push(err.constraints[key]));
    r = r.concat(extractErrorMessages(err.children));
  });
  return r;
};

export class ValidationException extends BadRequestException {
  constructor(errors) {
    super({
      statusCode: 400,
      error: 'VALIDATION_ERROR',
      messages: extractErrorMessages(errors),
    });
  }
}
