import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function MinDateFun(
  fun: (o: any) => Date,
  validationOptions?: ValidationOptions,
) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: 'minDateFunc',
      target: object.constructor,
      propertyName,
      constraints: [fun],
      options: validationOptions,
      validator: {
        validate(value: Date, args: ValidationArguments) {
          const date = fun(args.object);

          return value.setHours(0, 0, 0, 0) >= date.setHours(0, 0, 0, 0);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be after ${fun(args.object)}`;
        },
      },
    });
  };
}
