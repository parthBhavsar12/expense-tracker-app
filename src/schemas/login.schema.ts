import * as Yup from 'yup';

const loginValidationSchema = Yup.object().shape({
  password: Yup.string()
    .trim()
    .required('Password is required'),
});

export type UserLoginForm = Yup.InferType<typeof loginValidationSchema>;

export default loginValidationSchema;