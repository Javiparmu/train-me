import { StringValueObject } from '@/modules/Shared/domain/value-object/StringValueObject';

export class TrainerRole extends StringValueObject {
  constructor(value: string) {
    super(value);

    this.assertIsValidRole(value);
  }

  private assertIsValidRole(value: string): void {
    if (!['admin', 'trainer'].includes(value)) {
      throw new Error('Invalid role');
    }
  }
}
