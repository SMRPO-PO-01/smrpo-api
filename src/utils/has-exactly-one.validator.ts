import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

import { PROJECT_USER_ROLE } from '../modules/project/project-user-role.enum';

export function ExactlyOneRole(role: PROJECT_USER_ROLE, validationOptions?: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: 'exactlyOneRole',
      target: object.constructor,
      propertyName,
      constraints: [role],
      options: validationOptions,
      validator: {
        validate(value: Array<any>) {
          return value.filter(u => u.role === role).length === 1;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must include exactly one user with role ${role}`;
        },
      },
    });
  };
}
