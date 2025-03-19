export const Validator = {
    required: value => !!value?.trim(),
    maxLength: max => value => value.length <= max
  };