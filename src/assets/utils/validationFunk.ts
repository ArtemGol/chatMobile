type IValidation =
  | 'required'
  | 'email'
  | 'confirm'
  | 'maxLength'
  | 'minLength'
  | 'phone';

interface IValidProps {
  value: string;
  confirmPas?: string;
  fieldName?: string;
  max?: number;
  min?: number;
}

const validationRules: Record<string, Function> = {
  required: ({value, fieldName}: IValidProps) =>
    value.trim() !== '' ? '' : `Никнейм ${fieldName} занят`,
  email: ({value}: IValidProps) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return value
      ? emailPattern.test(value)
        ? ''
        : 'Неправильный формат email'
      : '';
  },
  confirm: ({value, confirmPas}: IValidProps) =>
    value ? (value === confirmPas ? '' : 'Пароли должны совпадать') : '',
  maxLength: ({value, max}: IValidProps) =>
    value
      ? value.length > (max || 0)
        ? `Exceeded ${max} characters`
        : ''
      : '',
  minLength: ({value, min}: IValidProps) =>
    value
      ? value.length < (min || 0)
        ? `Длина меньше ${min} символов`
        : ''
      : '',
  phone: ({value}: IValidProps) => {
    const phonePattern = /^[+\d]*$/;
    return value
      ? phonePattern.test(value)
        ? ''
        : 'Неправильный формат номера телефона'
      : '';
  },
};

interface IFunk {
  value: string;
  fieldName?: string;
  confirmPas?: string;
  max?: number;
  min?: number;
  errors: IValidation[];
}

export const validationFunk = ({
  value,
  fieldName,
  errors,
  confirmPas,
  max,
  min,
}: IFunk) => {
  const errorsTextArr = errors
    .map(el => validationRules[el]({value, fieldName, confirmPas, max, min}))
    .filter(el => !!el);
  return errorsTextArr.length ? errorsTextArr.join(',\n') : '';
};
